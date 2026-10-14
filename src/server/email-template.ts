import "server-only";
import { event } from "@/content/site";

/** Labelled row in a notification. Values are always escaped before reaching HTML. */
export interface Row {
  label: string;
  value: string;
}

interface Notification {
  /** e.g. "Event registration" — shown as a badge and in the subject */
  kind: string;
  title: string;
  rows: Row[];
  /** long-form answers rendered as blocks below the table */
  blocks?: Row[];
  note?: string;
}

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Submission time in the event's timezone (Africa/Lagos, WAT). */
export function submittedAt(date = new Date()) {
  return (
    new Intl.DateTimeFormat("en-NG", {
      timeZone: event.timeZone,
      dateStyle: "full",
      timeStyle: "short",
    }).format(date) + " (WAT)"
  );
}

export function renderNotification({ kind, title, rows, blocks = [], note }: Notification) {
  const all = [{ label: "Submitted", value: submittedAt() }, ...rows];

  const text = [
    `${kind.toUpperCase()} — ${title}`,
    "",
    ...all.map((r) => `${r.label}: ${r.value}`),
    ...blocks.flatMap((b) => ["", `${b.label}`, b.value]),
    ...(note ? ["", note] : []),
    "",
    "— Sent from the Adore Worship Movement website",
  ].join("\n");

  const cell = "padding:10px 0;border-top:1px solid #e7e0d0;vertical-align:top;font-size:14px;line-height:1.5";
  const html = `<!doctype html>
<html lang="en"><body style="margin:0;background:#f7f2e8;font-family:Helvetica,Arial,sans-serif;color:#0e1530">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f2e8;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#070e24;padding:24px 28px">
<p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#5fe0d3;font-weight:bold">${escapeHtml(kind)}</p>
<h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#fbf8f1;font-weight:normal">${escapeHtml(title)}</h1>
</td></tr>
<tr><td style="padding:20px 28px 8px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${all
  .map(
    (r) =>
      `<tr><th scope="row" align="left" style="${cell};width:38%;padding-right:12px;color:#555b74;font-weight:600">${escapeHtml(r.label)}</th><td style="${cell}">${escapeHtml(r.value)}</td></tr>`,
  )
  .join("\n")}
</table>
</td></tr>
${blocks
  .map(
    (b) =>
      `<tr><td style="padding:12px 28px"><p style="margin:0 0 6px;font-size:13px;color:#555b74;font-weight:600">${escapeHtml(b.label)}</p><div style="background:#fbf8f1;border-left:3px solid #f0b85c;padding:12px 14px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(b.value)}</div></td></tr>`,
  )
  .join("\n")}
${note ? `<tr><td style="padding:12px 28px"><p style="margin:0;font-size:13px;line-height:1.5;color:#8a5a12">${escapeHtml(note)}</p></td></tr>` : ""}
<tr><td style="padding:20px 28px 24px;font-size:12px;color:#555b74">Sent from the Adore Worship Movement website. Reply to this email to respond to the visitor directly.</td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { text, html };
}
