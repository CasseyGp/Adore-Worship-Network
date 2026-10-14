"use server";

import { event } from "@/content/site";
import type { FormState } from "@/lib/forms/types";
import { type EventField, validateEventRegistration } from "@/lib/forms/validation";
import { adminRecipients, sendEmail } from "@/server/integrations/email";
import { renderNotification } from "@/server/email-template";
import { guardSubmission } from "@/server/security";
import { formString, unavailableMessage } from "./shared";

export async function registerForEvent(
  _prev: FormState<EventField>,
  formData: FormData,
): Promise<FormState<EventField>> {
  const input = {
    fullName: formString(formData, "fullName", 120),
    email: formString(formData, "email", 254),
    phone: formString(formData, "phone", 30),
    consent: formData.get("consent") === "on",
    updates: formData.get("updates") === "on",
  };
  const values = { fullName: input.fullName, email: input.email, phone: input.phone, updates: input.updates ? "on" : "", consent: input.consent ? "on" : "" };

  const guard = await guardSubmission(formData, "event");
  if (!guard.ok) return { status: "error", values, message: guard.message };

  const errors = validateEventRegistration(input);
  if (Object.keys(errors).length) {
    return { status: "invalid", errors, values, message: "Please check the highlighted fields." };
  }

  const { text, html } = renderNotification({
    kind: "Event registration",
    title: `${event.name} — place reserved by ${input.fullName}`,
    rows: [
      { label: "Event", value: `${event.name}, ${event.dateLabel}, ${event.timeLabel}` },
      { label: "Venue", value: event.venue ?? "To be announced" },
      { label: "Full name", value: input.fullName },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone },
      { label: "Registration consent", value: "Yes" },
      { label: "Future Adore updates", value: input.updates ? "Yes, opted in" : "No" },
    ],
    note: "This is an event reservation only — it is not a member or outreach registration.",
  });

  const result = await sendEmail({
    to: adminRecipients(),
    subject: `[Event registration] ${event.name} — ${input.fullName}`,
    replyTo: input.email,
    text,
    html,
  });

  if (!result.ok) {
    if (result.reason === "failed") {
      return { status: "error", values, message: "We couldn’t send your registration just now. Your details are still here — please try again shortly." };
    }
    return { status: "unavailable", values, message: unavailableMessage("Event registration") };
  }

  return {
    status: "accepted",
    message: `Thank you — your place request for ${event.name} has been received by the team. We’ll be in touch by email with any further details.`,
  };
}
