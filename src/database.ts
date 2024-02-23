const database: Record<string, string> = {}

export function set(key: string, value: string): string {
  database[key] = value
  return key
}

export function get(key: string): string {
  return database[key] || ""
}