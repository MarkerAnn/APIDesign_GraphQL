/**
 * Encodes a numeric ID to a base64 cursor string
 */
export function encodeCursor(id: number): string {
  return Buffer.from(id.toString()).toString('base64')
}

/**
 * Decodes a base64 cursor string to a numeric ID
 */
export function decodeCursor(cursor: string): number {
  return parseInt(Buffer.from(cursor, 'base64').toString('ascii'), 10)
}
