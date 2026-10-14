"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { notifyTransfer } from "@/server/actions/giving";
import { type TransferDetails, supportConfig } from "@/content/support";
import type { FormState } from "@/lib/forms/types";
import { type GivingField, parseAmount, validateGiving } from "@/lib/forms/validation";
import { Arrow, buttonClass } from "@/components/ui/Button";
import { Field, FormNotice, Honeypot, SubmitButton, describe, inputClass } from "./fields";

const { currencySymbol, currency } = supportConfig;
const naira = (n: number) => `${currencySymbol}${n.toLocaleString("en-NG")}`;

/**
 * Voluntary giving by bank transfer.
 * Step 1 collects amount + name; step 2 (a native modal <dialog>) shows the account to pay into.
 * Nothing on this page confirms a payment: a transfer stays pending until the team sees it arrive.
 */
export function GivingPanel({ transfer }: { transfer: TransferDetails | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [amount, setAmount] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<Partial<Record<GivingField, string>>>({});
  // Bumped on every open so the notify step starts fresh each time.
  const [session, setSession] = useState(0);

  function open(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateGiving({ amount: parseAmount(amount), fullName, email: "" });
    setErrors(found);
    if (Object.keys(found).length) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setSession((s) => s + 1);
    dialogRef.current?.showModal();
  }

  const clear = (k: GivingField) =>
    setErrors((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });

  return (
    <>
      <form onSubmit={open} noValidate className="flex flex-col gap-6" aria-labelledby="give-title">
        <div>
          <h3 id="give-title" className="display text-[2rem] leading-none text-ivory-bright">
            Give by bank transfer
          </h3>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-mist">Choose an amount, then we’ll show you where to send it.</p>
        </div>

        <Field id="gv-amount" surface="dark" label={`Amount (${currency})`} required error={errors.amount}>
          <div className="relative">
            <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-amber">
              {currencySymbol}
            </span>
            <input
              id="gv-amount"
              name="amount"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                clear("amount");
                setAmount(e.target.value.replace(/[^\d,]/g, ""));
              }}
              className={`${inputClass("dark", !!errors.amount)} pl-10 text-lg font-semibold`}
              {...describe("gv-amount", errors.amount)}
            />
          </div>
        </Field>

        <Field id="gv-name" surface="dark" label="Contributor’s name" required error={errors.fullName}>
          <input
            id="gv-name"
            name="fullName"
            autoComplete="name"
            maxLength={120}
            value={fullName}
            onChange={(e) => {
              clear("fullName");
              setFullName(e.target.value);
            }}
            className={inputClass("dark", !!errors.fullName)}
            {...describe("gv-name", errors.fullName)}
          />
        </Field>

        <div className="flex flex-col gap-3">
          <button type="submit" className={buttonClass("primary", "w-full sm:w-auto sm:self-start")}>
            Continue to give <Arrow />
          </button>
          <p className="text-[0.85rem] leading-relaxed text-mist-dim">
            No card details are taken and nothing is charged on this site — you complete the transfer from your own bank.
          </p>
        </div>
      </form>

      <dialog
        ref={dialogRef}
        aria-labelledby="give-dialog-title"
        className="give-dialog m-auto max-h-[min(92dvh,52rem)] w-[min(100%-2rem,34rem)] overflow-y-auto overscroll-contain rounded-[1.75rem] bg-ivory-bright p-0 text-ink shadow-lift scheme-light backdrop:bg-midnight/75 max-sm:mb-0 max-sm:w-full max-sm:max-w-full max-sm:rounded-b-none"
      >
        <TransferSheet
          key={session}
          transfer={transfer}
          amount={parseAmount(amount)}
          fullName={fullName.trim()}
          onClose={() => dialogRef.current?.close()}
        />
      </dialog>
    </>
  );
}

interface SheetProps {
  transfer: TransferDetails | null;
  amount: number;
  fullName: string;
  onClose: () => void;
}

function TransferSheet({ transfer, amount, fullName, onClose }: SheetProps) {
  const [notice, notifyAction, notifying] = useActionState(notifyTransfer, { status: "idle" } as FormState<GivingField>);
  const reported = notice.status === "accepted";
  const narration = `${fullName} - Adore`.slice(0, 30);

  return (
    <div className="flex flex-col gap-6 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-teal-deep">Support the vision</p>
          <h2 id="give-dialog-title" className="display mt-2 text-[2rem] leading-[1.05] text-navy">
            You’re preparing to support the vision.
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 -mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-navy transition-colors hover:bg-navy/5"
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="m4 4 8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>

      <p
        role="status"
        className={`inline-flex items-center gap-2 self-start rounded-pill px-3.5 py-1.5 text-[0.8rem] font-semibold ${
          transfer ? "bg-amber/20 text-amber-deep" : "bg-navy/5 text-slate"
        }`}
      >
        <span aria-hidden="true" className={`size-2 rounded-full ${transfer ? "bg-amber-deep" : "bg-slate/50"}`} />
        {!transfer ? "Bank details awaiting confirmation" : reported ? "Transfer reported · awaiting confirmation" : "Awaiting your transfer"}
      </p>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-field border border-sand-line bg-sand-line">
        <div className="bg-white px-4 py-3">
          <dt className="eyebrow text-[0.62rem] text-muted">Amount ({currency})</dt>
          <dd className="display mt-1 text-[1.6rem] leading-none text-navy">{naira(amount)}</dd>
        </div>
        <div className="min-w-0 bg-white px-4 py-3">
          <dt className="eyebrow text-[0.62rem] text-muted">Contributor’s name</dt>
          <dd className="mt-1.5 truncate font-semibold text-navy">{fullName}</dd>
        </div>
      </dl>

      <section aria-labelledby="give-account-title" className="rounded-field bg-navy p-5 text-ivory">
        <h3 id="give-account-title" className="eyebrow text-cyan">
          Transfer to
        </h3>
        {transfer ? (
          <dl className="mt-4 flex flex-col gap-3.5">
            <Row label="Bank name" value={transfer.bankName} />
            <Row label="Account name" value={transfer.accountName} />
            <div>
              <dt className="text-[0.75rem] text-mist-dim">Account number</dt>
              <dd className="mt-1 flex flex-wrap items-center justify-between gap-3">
                <span id="give-account-number" className="font-mono text-[1.5rem] font-semibold tracking-[0.12em] text-ivory-bright">
                  {transfer.accountNumber}
                </span>
                <CopyButton value={transfer.accountNumber} />
              </dd>
            </div>
          </dl>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            <dl className="flex flex-col gap-2 text-[0.92rem]">
              {["Bank name", "Account name", "Account number"].map((l) => (
                <div key={l} className="flex justify-between gap-4 border-b border-ivory/10 pb-2">
                  <dt className="text-mist-dim">{l}</dt>
                  <dd className="italic text-mist">Awaiting confirmation</dd>
                </div>
              ))}
            </dl>
            <p className="text-[0.88rem] leading-relaxed text-mist">
              The account for giving is still being confirmed by the team. Please don’t send a transfer until the details appear
              here.
            </p>
            <button type="button" disabled className={buttonClass("ghost-dark", "w-full")}>
              Copy account number
            </button>
          </div>
        )}
      </section>

      {transfer ? (
        <>
          <section aria-labelledby="give-steps-title">
            <h3 id="give-steps-title" className="text-[0.95rem] font-bold text-navy">
              How to complete your gift
            </h3>
            <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-[0.92rem] leading-relaxed text-slate marker:font-semibold marker:text-teal-deep">
              <li>
                Open your banking app and transfer <strong className="text-navy">{naira(amount)}</strong> to the account above.
              </li>
              <li>
                Use <strong className="text-navy">{narration}</strong> as the narration or reference, so the team can recognise your gift.
              </li>
              <li>Your gift is confirmed only once the team sees it arrive in the account — this page can’t confirm payments.</li>
            </ol>
          </section>

          {reported ? (
            <FormNotice state={notice} />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                startTransition(() => notifyAction(fd));
              }}
              noValidate
              className="relative flex flex-col gap-4 border-t border-sand-line pt-5">
              <Honeypot />
              <input type="hidden" name="amount" value={String(amount)} />
              <input type="hidden" name="fullName" value={fullName} />
              <p className="text-[0.9rem] leading-relaxed text-slate">
                Made the transfer? You can let the team know to look out for it (optional).
              </p>
              <Field id="gv-email" label="Email, if you’d like an acknowledgement" error={notice.errors?.email}>
                <input
                  id="gv-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={254}
                  defaultValue={typeof notice.values?.email === "string" ? notice.values.email : undefined}
                  className={inputClass("light", !!notice.errors?.email)}
                  {...describe("gv-email", notice.errors?.email)}
                />
              </Field>
              <FormNotice state={notice} />
              <SubmitButton variant="navy" pending={notifying}>I’ve made the transfer — notify the team</SubmitButton>
            </form>
          )}
        </>
      ) : null}

      <button type="button" onClick={onClose} className={buttonClass("ghost-light", "w-full")}>
        Close
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.75rem] text-mist-dim">{label}</dt>
      <dd className="mt-0.5 text-[1.05rem] font-semibold text-ivory-bright">{value}</dd>
    </div>
  );
}

/** Clipboard API first; falls back to execCommand, then to selecting the number for manual copy. */
function CopyButton({ value }: { value: string }) {
  const [result, setResult] = useState<"idle" | "copied" | "manual">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy(e: React.MouseEvent<HTMLButtonElement>) {
    // Read before awaiting — React clears currentTarget once the handler yields.
    const host = e.currentTarget.closest("dialog") ?? document.body;
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      // Inside a modal <dialog> the rest of the page is inert, so the helper must live in the dialog.
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      host.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
    }
    if (!ok) {
      const el = document.getElementById("give-account-number");
      if (el) window.getSelection()?.selectAllChildren(el);
    }
    setResult(ok ? "copied" : "manual");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setResult("idle"), 3000);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={buttonClass(result === "copied" ? "ivory" : "primary", "min-h-11! px-4! text-sm!")}
      >
        {result === "copied" ? (
          <>
            <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="m3.5 8.5 3 3 6-7" />
            </svg>
            Copied
          </>
        ) : (
          "Copy account number"
        )}
      </button>
      <span aria-live="polite" className={result === "manual" ? "w-full text-[0.8rem] text-amber-soft" : "sr-only"}>
        {result === "copied" ? "Account number copied." : result === "manual" ? "Couldn’t copy automatically — the number is selected, so copy it manually." : ""}
      </span>
    </>
  );
}
