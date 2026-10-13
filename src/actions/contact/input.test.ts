import { describe, expect, test } from "vitest";
import { contactInput } from "./input";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello Luuk",
  website: "",
  token: "token",
  "frc-captcha-response": "solution",
};

describe("contactInput", () => {
  test("accepts a valid submission and trims name and message", () => {
    const result = contactInput.safeParse({ ...valid, name: "  Ada  ", message: "  Hi  " });

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("Ada");
    expect(result.data?.message).toBe("Hi");
  });

  test.each([
    ["missing", undefined],
    ["only whitespace", "   "],
    ["longer than 100 characters", "a".repeat(101)],
    ["a line feed", "Ada\nBcc: spam@example.com"],
    ["a carriage return", "Ada\rBcc: spam@example.com"],
  ])("rejects a name that is %s", (_, name) => {
    expect(contactInput.safeParse({ ...valid, name }).success).toBe(false);
  });

  test.each([
    ["missing", undefined],
    ["not an email address", "ada"],
    ["longer than 254 characters", `${"a".repeat(250)}@example.com`],
    ["a line feed", "ada@example.com\nBcc: spam@example.com"],
  ])("rejects an email that is %s", (_, email) => {
    expect(contactInput.safeParse({ ...valid, email }).success).toBe(false);
  });

  test.each([
    ["missing", undefined],
    ["only whitespace", "   "],
    ["longer than 5000 characters", "a".repeat(5001)],
  ])("rejects a message that is %s", (_, message) => {
    expect(contactInput.safeParse({ ...valid, message }).success).toBe(false);
  });

  test("allows line breaks in the message", () => {
    expect(contactInput.safeParse({ ...valid, message: "Hi\r\nLuuk" }).success).toBe(true);
  });

  test("accepts a filled honeypot so the handler can ignore it quietly", () => {
    expect(contactInput.safeParse({ ...valid, website: "https://spam.example" }).success).toBe(
      true,
    );
  });

  test("rejects a missing form token", () => {
    expect(contactInput.safeParse({ ...valid, token: undefined }).success).toBe(false);
  });

  test("rejects a missing captcha solution", () => {
    expect(contactInput.safeParse({ ...valid, "frc-captcha-response": "" }).success).toBe(false);
  });
});
