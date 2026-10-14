export type IntegrationResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "not_implemented" | "failed"; detail?: string };
