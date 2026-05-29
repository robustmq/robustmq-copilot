#!/usr/bin/env bash
# Copyright 2023 RobustMQ Team
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Package robustmq-copilot changed files into a tar.gz and sync to remote server.
# Usage: ./package.sh [output_dir]

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
REMOTE_HOST="root@117.72.92.117"
REMOTE_DIR="/root/robustmq-copilot"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
OUTPUT_DIR="${1:-$PROJECT_ROOT}"

# ── Logging helpers ────────────────────────────────────────────────────────────
info()  { echo "[INFO]  $*"; }
warn()  { echo "[WARN]  $*" >&2; }
error() { echo "[ERROR] $*" >&2; }

# ── Version / archive name ─────────────────────────────────────────────────────
VERSION=$(git -C "$PROJECT_ROOT" describe --tags --always --dirty 2>/dev/null || echo "dev")
TIMESTAMP=$(date +%Y%m%d%H%M%S)_$$
ARCHIVE="$OUTPUT_DIR/robustmq-copilot-${VERSION}-${TIMESTAMP}.tar.gz"

# Always remove the local archive on exit (success, failure, or signal)
trap 'rm -f "$ARCHIVE"' EXIT

# ── Branch detection ───────────────────────────────────────────────────────────
LOCAL_BRANCH=$(git -C "$PROJECT_ROOT" rev-parse --abbrev-ref HEAD)
info "Local branch: ${LOCAL_BRANCH}"

# ── Collect changed files ──────────────────────────────────────────────────────
# 1. Committed locally but not yet pushed
COMMITTED_FILES=$(git -C "$PROJECT_ROOT" diff --name-only --diff-filter=ACM \
  "origin/${LOCAL_BRANCH}" HEAD 2>/dev/null || true)

# 2. Modified in working tree but not committed
WORKDIR_FILES=$(git -C "$PROJECT_ROOT" diff --name-only --diff-filter=ACM \
  HEAD 2>/dev/null || true)

# 3. Untracked new files (entire repo, respects .gitignore), exclude node_modules
UNTRACKED_FILES=$(git -C "$PROJECT_ROOT" ls-files --others --exclude-standard \
  2>/dev/null | grep -v 'node_modules' || true)

# 4. Files deleted locally that exist on origin → remove on remote
# Case A: committed deletions (diff between origin and HEAD)
_DELETED_COMMITTED=$(git -C "$PROJECT_ROOT" diff --name-only --diff-filter=D \
  "origin/${LOCAL_BRANCH}" HEAD 2>/dev/null || true)
# Case B: workdir deletions not yet staged/committed (git ls-files --deleted)
_DELETED_WORKDIR=$(git -C "$PROJECT_ROOT" ls-files --deleted 2>/dev/null || true)

# Merge both, keep only files truly gone from disk
DELETED_FILES=""
while IFS= read -r f; do
  [[ -n "$f" && ! -e "$PROJECT_ROOT/$f" ]] && DELETED_FILES="${DELETED_FILES}${f}"$'\n'
done <<< "$(printf '%s\n%s' "$_DELETED_COMMITTED" "$_DELETED_WORKDIR" | sort -u)"
DELETED_FILES="${DELETED_FILES%$'\n'}"

# Combine, deduplicate, always include root-level project files, exclude archives & node_modules
count_lines() { echo "${1}" | grep -c '[^[:space:]]' 2>/dev/null || echo 0; }

ALL_FILES=$(printf '%s\n%s\n%s\nLICENSE\nREADME.md\npackage.json\npackage.sh\npnpm-lock.yaml\npnpm-workspace.yaml\ntsconfig.json' \
    "$COMMITTED_FILES" "$WORKDIR_FILES" "$UNTRACKED_FILES" \
  | grep -v '\.tar\.gz$' \
  | grep -v 'node_modules' \
  | grep '[^[:space:]]' \
  | sort -u || true)

# ── Debug summary ──────────────────────────────────────────────────────────────
echo "--- File sources ---"
info "[committed vs origin] $(count_lines "$COMMITTED_FILES") file(s)"
echo "$COMMITTED_FILES" | grep '[^[:space:]]' | sed 's/^/  + /' || true
info "[workdir vs HEAD]     $(count_lines "$WORKDIR_FILES") file(s)"
echo "$WORKDIR_FILES"   | grep '[^[:space:]]' | sed 's/^/  ~ /' || true
info "[untracked]           $(count_lines "$UNTRACKED_FILES") file(s)"
echo "$UNTRACKED_FILES" | grep '[^[:space:]]' | sed 's/^/  ? /' || true
info "[deleted locally]     $(count_lines "$DELETED_FILES") file(s)"
echo "$DELETED_FILES"   | grep '[^[:space:]]' | sed 's/^/  - /' || true
echo "--------------------"

# ── Build archive ──────────────────────────────────────────────────────────────
if [[ -z "$ALL_FILES" ]]; then
  info "No changed files to package."
  SKIP_ARCHIVE=1
else
  SKIP_ARCHIVE=0
  FILE_COUNT=$(echo "$ALL_FILES" | grep -c '[^[:space:]]')
  info "Packaging ${FILE_COUNT} file(s):"
  echo "$ALL_FILES" | sed 's/^/  /'
  echo "$ALL_FILES" | tr '\n' '\0' \
    | COPYFILE_DISABLE=1 tar czf "$ARCHIVE" -C "$PROJECT_ROOT" --null -T -
  info "Archive created: $ARCHIVE ($(du -sh "$ARCHIVE" | cut -f1))"
fi

# ── Upload archive ─────────────────────────────────────────────────────────────
ARCHIVE_NAME="$(basename "$ARCHIVE")"
if [[ "${SKIP_ARCHIVE}" -eq 0 ]]; then
  info "Uploading to ${REMOTE_HOST}:${REMOTE_DIR} ..."
  scp "$ARCHIVE" "${REMOTE_HOST}:${REMOTE_DIR}/"
  info "Upload complete: ${REMOTE_HOST}:${REMOTE_DIR}/${ARCHIVE_NAME}"
fi

# ── Remote: pull → extract → commit → push ────────────────────────────────────
info "Syncing remote ..."
# Base64-encode the deleted file list to safely pass multi-line value over SSH env
DELETED_LIST_B64=$(printf '%s' "${DELETED_FILES}" | base64 | tr -d '\n')

ssh "${REMOTE_HOST}" \
  REMOTE_DIR="${REMOTE_DIR}" \
  LOCAL_BRANCH="${LOCAL_BRANCH}" \
  ARCHIVE_NAME="${ARCHIVE_NAME}" \
  SKIP_ARCHIVE="${SKIP_ARCHIVE}" \
  DELETED_LIST_B64="${DELETED_LIST_B64}" \
  'bash -s' <<'REMOTE_SCRIPT'
set -euo pipefail

info()  { echo "[INFO]  $*"; }
error() { echo "[ERROR] $*" >&2; }

# Decode the base64-encoded deleted file list
DELETED_LIST=$(printf '%s' "${DELETED_LIST_B64}" | base64 -d 2>/dev/null || true)

cd "${REMOTE_DIR}"

# Switch branch if needed
REMOTE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
info "Remote branch: ${REMOTE_BRANCH}"
if [[ "${REMOTE_BRANCH}" != "${LOCAL_BRANCH}" ]]; then
  info "Switching to branch ${LOCAL_BRANCH} ..."
  git fetch origin
  git checkout "${LOCAL_BRANCH}" 2>/dev/null \
    || git checkout -b "${LOCAL_BRANCH}" "origin/${LOCAL_BRANCH}"
fi

# Pull latest before extracting
info "Pulling origin/${LOCAL_BRANCH} ..."
git pull origin "${LOCAL_BRANCH}"

# Extract the uploaded archive
if [[ "${SKIP_ARCHIVE}" -eq 0 && -f "${ARCHIVE_NAME}" ]]; then
  info "Extracting ${ARCHIVE_NAME} ..."
  tar xzf "${ARCHIVE_NAME}" --warning=no-unknown-keyword
  rm -f "${ARCHIVE_NAME}"
fi

# Remove stale archives
find "${REMOTE_DIR}" -maxdepth 1 -name '*.tar.gz' -delete

# Remove files deleted locally
if [[ -n "${DELETED_LIST}" ]]; then
  info "Removing locally-deleted files on remote ..."
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    target="${REMOTE_DIR}/${f}"
    if rm -f -- "$target"; then
      info "  Deleted: ${f}"
    fi
  done <<< "${DELETED_LIST}"
fi

# Commit and push
git add -A
if git diff --cached --quiet; then
  info "Nothing to commit on remote."
else
  git commit -m 'dev'

  MAX_RETRIES=3
  RETRY=0
  DELAY=2
  until git push origin "${LOCAL_BRANCH}" 2>&1 | tee /tmp/push_output.txt; do
    PUSH_OUTPUT=$(cat /tmp/push_output.txt)
    if echo "${PUSH_OUTPUT}" | grep -qiE 'refusing|403|permission|scope|authentication|not allowed'; then
      error "Push permanently rejected (auth/permission error). Aborting."
      cat /tmp/push_output.txt
      exit 1
    fi
    RETRY=$((RETRY + 1))
    if [[ ${RETRY} -ge ${MAX_RETRIES} ]]; then
      error "Push failed after ${MAX_RETRIES} retries. Giving up."
      exit 1
    fi
    info "Push failed, retrying in ${DELAY}s (${RETRY}/${MAX_RETRIES}) ..."
    sleep "${DELAY}"
    DELAY=$((DELAY * 2))
  done

  if [[ ${RETRY} -eq 0 ]]; then
    info "Push succeeded."
  else
    info "Push succeeded after ${RETRY} retry/retries."
  fi
fi

info "Remote sync done."
REMOTE_SCRIPT

info "Remote sync complete."

# ── Local commit: stage exactly the packaged files ────────────────────────────
if [[ "${SKIP_ARCHIVE}" -eq 0 && -n "$ALL_FILES" ]] || [[ -n "$DELETED_FILES" ]]; then
  info "Committing packaged files locally ..."
  while IFS= read -r f; do
    [[ -n "$f" ]] && git -C "$PROJECT_ROOT" add -- "$f" 2>/dev/null || true
  done <<< "$ALL_FILES"

  if [[ -n "$DELETED_FILES" ]]; then
    while IFS= read -r f; do
      [[ -n "$f" ]] && git -C "$PROJECT_ROOT" rm --cached --force -- "$f" 2>/dev/null || true
    done <<< "$DELETED_FILES"
  fi

  if git -C "$PROJECT_ROOT" diff --cached --quiet; then
    info "Nothing to commit locally."
  else
    git -C "$PROJECT_ROOT" commit -m 'dev'
    info "Local commit done. Unpackaged files remain unstaged."
  fi
fi

# Trap handles archive cleanup
info "All done."
