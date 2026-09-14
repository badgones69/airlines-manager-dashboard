export function isNotBlank(value: string): boolean {
  return !!value && value.trim() !== '';
}