import { ActionError, defineAction } from "astro:actions";
import {
  CONTACT_FORM_SECRET,
  CONTACT_RECIPIENT,
  CONTACT_SENDER,
  FRIENDLY_CAPTCHA_API_KEY,
  LETTERMINT_TOKEN,
} from "astro:env/server";
import { FRIENDLY_CAPTCHA_SITEKEY } from "astro:env/client";
import { verifyCaptcha } from "./contact/captcha";
import { verifyFormToken } from "./contact/form-token";
import { handleContact } from "./contact/handle-contact";
import { contactInput } from "./contact/input";
import { sendContactMessage } from "./contact/send";

export const server = {
  contact: defineAction({
    accept: "form",
    input: contactInput,
    handler: async (input) => {
      const outcome = await handleContact(input, {
        verifyToken: (token) => verifyFormToken(token, CONTACT_FORM_SECRET),
        verifyCaptcha: (solution) =>
          verifyCaptcha(solution, {
            apiKey: FRIENDLY_CAPTCHA_API_KEY,
            sitekey: FRIENDLY_CAPTCHA_SITEKEY,
          }),
        send: (message) =>
          sendContactMessage(message, {
            token: LETTERMINT_TOKEN,
            sender: CONTACT_SENDER,
            recipient: CONTACT_RECIPIENT,
          }),
      });
      if (outcome === "rejected") {
        throw new ActionError({ code: "FORBIDDEN" });
      }
    },
  }),
};
