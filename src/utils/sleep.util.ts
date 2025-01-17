export async function sleep(s: number) {
  return new Promise((r) => setTimeout(r, s * 1000));
}
