export function resolveCopy(key: string, map: Map<string, string> | null | undefined): string {
  if (!map) {
    return key;
  }
  if (map.has(key)) {
    const value = map.get(key);
    return value ?? key;
  }
  return key;
}

export function isMissingKey(key: string, resolved: string): boolean {
  return resolved === key;
}
