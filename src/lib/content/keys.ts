export function slugToArea(slug: string): string {
  return slug.replace(/-/g, "_");
}

export function pageKey(area: string, field: string): string {
  return `osk.${area}.${field}`;
}
