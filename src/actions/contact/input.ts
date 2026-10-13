import { z } from "astro/zod";

const singleLine = /^[^\r\n]*$/;

export const contactInput = z.object({
  name: z.string().trim().min(1).max(100).regex(singleLine),
  email: z.email().max(254),
  message: z.string().trim().min(1).max(5000),
  website: z.string().optional(),
  token: z.string().min(1),
  "frc-captcha-response": z.string().min(1),
});
