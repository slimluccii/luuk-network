import { afterEach, describe, expect, test, vi } from "vitest";
import { verifyCaptcha } from "./captcha";

const config = { apiKey: "api-key", sitekey: "sitekey" };

function respondWith(status: number, body: unknown) {
  const fetch = vi.fn(async () => Response.json(body, { status }));
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("verifyCaptcha", () => {
  test("sends the solution and sitekey with the API key", async () => {
    const fetch = respondWith(200, { success: true });

    await verifyCaptcha("solution", config);

    expect(fetch).toHaveBeenCalledWith(
      "https://global.frcapi.com/api/v2/captcha/siteverify",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "X-API-Key": "api-key" }),
        body: JSON.stringify({ response: "solution", sitekey: "sitekey" }),
      }),
    );
  });

  test("accepts a verified solution", async () => {
    respondWith(200, { success: true });

    expect(await verifyCaptcha("solution", config)).toBe(true);
  });

  test("rejects a solution that was already used", async () => {
    respondWith(200, { success: false, error: { error_code: "response_duplicate" } });

    expect(await verifyCaptcha("solution", config)).toBe(false);
  });

  test("rejects a success field that is not literally true", async () => {
    respondWith(200, { success: "true" });

    expect(await verifyCaptcha("solution", config)).toBe(false);
  });

  test("rejects when the API refuses the request", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    respondWith(401, { success: false, error: { error_code: "auth_invalid" } });

    expect(await verifyCaptcha("solution", config)).toBe(false);
  });

  test("rejects when the API is unreachable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    expect(await verifyCaptcha("solution", config)).toBe(false);
  });
});
