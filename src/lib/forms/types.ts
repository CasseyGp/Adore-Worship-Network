export type FormStatus =
  /** nothing submitted yet */
  | "idle"
  /** server rejected the input — see `errors` */
  | "invalid"
  /** input was valid, but the downstream service is not configured yet */
  | "unavailable"
  /** downstream service accepted the submission */
  | "accepted"
  /** downstream service failed */
  | "error";

export interface FormState<Field extends string = string> {
  status: FormStatus;
  message?: string;
  errors?: Partial<Record<Field, string>>;
  /** echoed back so fields keep their values after a server round-trip */
  values?: Partial<Record<Field, string | string[]>>;
  /** set when a payment checkout is ready */
  redirectUrl?: string;
}

export const idleState: FormState = { status: "idle" };
