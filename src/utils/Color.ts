/**
 * 文字列が有効なCSSカラーが検証する
 * @param color 検証するカラー文字列
 * @returns 有効なCSSカラーならば true
 */
export function isValidColor(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color != "";
}
