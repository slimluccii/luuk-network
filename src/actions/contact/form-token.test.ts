import { describe, expect, test } from "vitest";
import { createFormToken, verifyFormToken } from "./form-token";

const secret = "test-secret";
const issuedAt = Date.UTC(2026, 9, 13, 12, 0, 0);
const seconds = (n: number) => issuedAt + n * 1000;

describe("verifyFormToken", () => {
  test("accepts a token submitted after 3 seconds", async () => {
    const token = await createFormToken(secret, issuedAt);

    expect(await verifyFormToken(token, secret, seconds(3))).toBe(true);
  });

  test("rejects a token submitted within 3 seconds", async () => {
    const token = await createFormToken(secret, issuedAt);

    expect(await verifyFormToken(token, secret, seconds(2))).toBe(false);
  });

  test("rejects a token older than 2 hours", async () => {
    const token = await createFormToken(secret, issuedAt);

    expect(await verifyFormToken(token, secret, seconds(2 * 60 * 60 + 1))).toBe(false);
  });

  test("rejects a token whose timestamp was changed", async () => {
    const token = await createFormToken(secret, issuedAt);
    const [, signature] = token.split(".");

    expect(await verifyFormToken(`${seconds(-60)}.${signature}`, secret, seconds(3))).toBe(false);
  });

  test("rejects a token signed with another secret", async () => {
    const token = await createFormToken("other-secret", issuedAt);

    expect(await verifyFormToken(token, secret, seconds(3))).toBe(false);
  });

  test.each(["", "garbage", "123.", ".abc", "a.b.c"])(
    "rejects malformed token %j",
    async (token) => {
      expect(await verifyFormToken(token, secret, seconds(3))).toBe(false);
    },
  );
});
