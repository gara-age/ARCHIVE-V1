/** Resolve public assets beneath Vite's deployment base (including GitHub project Pages). */
export function assetUrl(path: string, base = import.meta.env?.BASE_URL ?? "/") {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
  return `${base.replace(/\/?$/, "/")}${path.replace(/^\/+/, "")}`;
}
