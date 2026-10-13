import { afterEach, describe, expect, test, vi } from "vitest";
import { sendContactMessage } from "./send";

const config = { token: "token", sender: "site@example.com", recipient: "me@example.com" };
const message = { name: "Ada", email: "ada@example.com", message: "Hello\nLuuk" };

function respondWith(status: number) {
  const fetch = vi.fn(async () => Response.json({}, { status }));
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sendContactMessage", () => {
  test("sends the message to the recipient with the visitor as reply-to", async () => {
    const fetch = respondWith(202);

    await sendContactMessage(message, config);

    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.lettermint.co/v1/send");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "x-lettermint-token": "token" });
    expect(JSON.parse(init.body as string)).toMatchObject({
      from: "site@example.com",
      to: ["me@example.com"],
      reply_to: ["ada@example.com"],
      subject: expect.stringContaining("Ada"),
      text: expect.stringContaining("Hello\nLuuk"),
    });
  });

  test("throws when the message is not accepted", async () => {
    respondWith(422);

    await expect(sendContactMessage(message, config)).rejects.toThrow();
  });
});
