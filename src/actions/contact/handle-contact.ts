import type { z } from "astro/zod";
import type { contactInput } from "./input";
import type { ContactMessage } from "./send";

type Dependencies = {
  verifyToken: (token: string) => Promise<boolean>;
  verifyCaptcha: (solution: string) => Promise<boolean>;
  send: (message: ContactMessage) => Promise<void>;
};

export async function handleContact(
  {
    name,
    email,
    message,
    website,
    token,
    "frc-captcha-response": solution,
  }: z.infer<typeof contactInput>,
  { verifyToken, verifyCaptcha, send }: Dependencies,
): Promise<"sent" | "rejected"> {
  if (website) return "sent";

  // The token goes first because a captcha solution can only be verified once
  if (!(await verifyToken(token)) || !(await verifyCaptcha(solution))) return "rejected";

  await send({ name, email, message });
  return "sent";
}
