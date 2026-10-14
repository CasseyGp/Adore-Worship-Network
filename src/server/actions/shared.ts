import "server-only";

export function formString(fd: FormData, key: string, max = 2000): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.slice(0, max).trim() : "";
}

export function unavailableMessage(what: string) {
  return `${what} isn’t open online yet. Your details have not been sent or stored — please check back soon.`;
}
