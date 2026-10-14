"use client";

import { type FormEvent, startTransition, useState } from "react";

/**
 * Runs the shared validator, then dispatches the server action manually.
 *
 * Submitting through `startTransition` instead of `<form action>` avoids React 19's automatic
 * form reset, which would otherwise clear controlled fields (role, outreach choices) in the DOM
 * after a recoverable server error. The server re-validates everything — this only saves a round-trip.
 */
export function useClientValidation<F extends string>(
  validate: (fd: FormData) => Partial<Record<F, string>>,
  dispatch: (fd: FormData) => void,
) {
  const [errors, setErrors] = useState<Partial<Record<F, string>> | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const found = validate(fd);
    const keys = Object.keys(found);
    if (keys.length) {
      setErrors(found);
      e.currentTarget.querySelector<HTMLElement>(`[name="${keys[0]}"]`)?.focus();
      return;
    }
    setErrors(null);
    startTransition(() => dispatch(fd));
  }

  /** Clear an individual error once the visitor edits that field. */
  function clear(field: F) {
    setErrors((prev) => {
      if (!prev?.[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  return { clientErrors: errors, onSubmit, clear };
}
