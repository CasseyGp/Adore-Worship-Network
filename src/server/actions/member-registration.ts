"use server";

import { ROLE_OTHER, outreachArms, roleOptions } from "@/content/outreach";
import type { FormState } from "@/lib/forms/types";
import { type MemberField, validateMemberRegistration } from "@/lib/forms/validation";
import { adminRecipients, sendEmail } from "@/server/integrations/email";
import { renderNotification } from "@/server/email-template";
import { guardSubmission } from "@/server/security";
import { formString, unavailableMessage } from "./shared";

export async function registerMember(
  _prev: FormState<MemberField>,
  formData: FormData,
): Promise<FormState<MemberField>> {
  const input = {
    fullName: formString(formData, "fullName", 120),
    email: formString(formData, "email", 254),
    phone: formString(formData, "phone", 30),
    role: formString(formData, "role", 60),
    roleOther: formString(formData, "roleOther", 120),
    // Dedupe and cap before validating so a crafted request can't smuggle in extra arms.
    arms: [...new Set(formData.getAll("arms").filter((v): v is string => typeof v === "string"))].slice(0, 10),
    motivation: formString(formData, "motivation", 1600),
    consent: formData.get("consent") === "on",
  };
  const values = {
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    role: input.role,
    roleOther: input.roleOther,
    arms: input.arms,
    motivation: input.motivation,
    consent: input.consent ? "on" : "",
  };

  const guard = await guardSubmission(formData, "member");
  if (!guard.ok) return { status: "error", values, message: guard.message };

  const errors = validateMemberRegistration(input);
  if (Object.keys(errors).length) {
    return { status: "invalid", errors, values, message: "Please check the highlighted fields." };
  }

  const roleLabel = roleOptions.find((r) => r.value === input.role)?.label ?? input.role;
  const role = input.role === ROLE_OTHER ? `Other — ${input.roleOther}` : roleLabel;
  const arms = input.arms.map((id) => outreachArms.find((a) => a.id === id)?.name ?? id);

  const { text, html } = renderNotification({
    kind: "Member registration & outreach",
    title: `New member — ${input.fullName}`,
    rows: [
      { label: "Full name", value: input.fullName },
      { label: "Phone / WhatsApp", value: input.phone },
      { label: "Email", value: input.email },
      { label: "Primary role / skill", value: role },
      ...arms.map((a, i) => ({ label: `Outreach choice ${i + 1}`, value: a })),
      { label: "Consent to be contacted", value: "Yes" },
    ],
    blocks: [{ label: "Why do you feel led to serve in your selected outreach arm?", value: input.motivation }],
    note: "This is a member / outreach registration — it is not an event reservation for Worship Therapy.",
  });

  const result = await sendEmail({
    to: adminRecipients(),
    subject: `[Member registration] ${input.fullName} — ${arms.join(" & ")}`,
    replyTo: input.email,
    text,
    html,
  });

  if (!result.ok) {
    if (result.reason === "failed") {
      return { status: "error", values, message: "We couldn’t send your details just now. Everything you entered is still here — please try again shortly." };
    }
    return { status: "unavailable", values, message: unavailableMessage("Member registration") };
  }

  return { status: "accepted", message: "Thank you for offering your gifts. Your details have reached the team, and they’ll be in touch about serving." };
}
