export function toCSV(rows: string[][]): string {
  const escape = (v: string) => (/[,"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v);
  return rows.map(r => r.map(escape).join(",")).join("\n");
}
