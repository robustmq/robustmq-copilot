#!/bin/sh
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

set -u -e

SCRIPT_DIR="$(dirname "$0")"
BASE_PATH="$SCRIPT_DIR/../../../robustmq-proto/protos"

GENERATE_BASE_PATH="$SCRIPT_DIR/../protos"

if [ ! -d "$BASE_PATH" ]; then
    echo "$BASE_PATH does't exist"
    exit 1
fi

# clean the generate path
rm -rf "$GENERATE_BASE_PATH"

mkdir -p "$GENERATE_BASE_PATH"


generate_proto_files() {
  local service_name="$1"
  local target_dir=""
  local proto_files=""
  
  local common_proto_folder="$BASE_PATH"
  local generate_path="$GENERATE_BASE_PATH/$service_name"

  mkdir -p "$generate_path"

  # Set target directory based on service type
  if [[ "$service_name" == "vendor" ]]; then
    target_dir="$BASE_PATH/$service_name/validate"
  else
    target_dir="$BASE_PATH/$service_name/proto"
  fi

  while IFS= read -r file; do
    # Handle both /proto/ and vendor/validate/ directory files
    if [[ "$file" == *"/proto/"* ]] || [[ "$file" == *"/vendor/validate/"* ]]; then
      # For /proto/ files, extract the relative path after /proto/
      # For vendor/validate files, keep the validate/ prefix
      if [[ "$file" == *"/proto/"* ]]; then
        relative_file_name=$(echo "$file" | sed -E 's/.*\/proto\/(.*)/\1/')
      else
        relative_file_name=$(echo "$file" | sed -E 's/.*\/validate\/(.*)/\1/')
      fi

      if [[ "$proto_files" != *"$relative_file_name"* ]]; then
        proto_files="$proto_files $relative_file_name"
      fi
    fi
  done < <(find "$target_dir" -type f -name "*.proto")
  
  protoc -I="$target_dir" -I="$common_proto_folder" $proto_files \
    --js_out="import_style=commonjs:$generate_path" \
    --grpc-web_out="import_style=typescript,mode=grpcwebtext:$generate_path"
}

generate_proto_files "broker_mqtt"
generate_proto_files "journal_server"
generate_proto_files "placement_center"
generate_proto_files "vendor"


update_imports() {
  perform_sed() {
    local file="$1"
    local pattern="$2"
    local replacement="$3"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s|$pattern|$replacement|g" "$file"
    else
      sed -i "s|$pattern|$replacement|g" "$file"
    fi
  }
  
  # Update JS files
  find "$GENERATE_BASE_PATH" -type f -name "*.js" | while read -r file; do
    perform_sed "$file" \
      "var vendor_validate_validate_pb = require('./vendor/validate/validate_pb.js');" \
      "var vendor_validate_validate_pb = require('../vendor/validate_pb.js');"
  done

  find "$GENERATE_BASE_PATH" -type f -name "*.d.ts" | while read -r file; do
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' 's|import \* as vendor_validate_validate_pb from '\''./vendor/validate/validate_pb'\'';\(.*\)|import * as vendor_validate_validate_pb from '\''../vendor/validate_pb'\'';\1|g' "$file"
    else
      sed -i 's|import \* as vendor_validate_validate_pb from '\''./vendor/validate/validate_pb'\'';\(.*\)|import * as vendor_validate_validate_pb from '\''../vendor/validate_pb'\'';\1|g' "$file"
    fi
  done
}


update_imports 