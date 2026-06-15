// Encode/decode a value that may contain '/' (e.g. MQTT topic names) so it can be
// safely carried in a URL path segment. Many servers reject an encoded slash
// (`%2F`) inside a path and return 500/400, so we base64url-encode such ids.

export function encodeRouteId(value: string): string {
  return btoa(encodeURIComponent(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeRouteId(encoded: string): string {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(atob(b64));
  } catch {
    // Fall back to the raw value (e.g. legacy links that were not encoded).
    return encoded;
  }
}
