import { describe, expect, test, vi } from "vitest";
import { handleContact } from "./handle-contact";

const input = {
  name: "Ada",
  email: "ada@example.com",
  message: "Hello",
  website: "",
  token: "token",
  "frc-captcha-response": "solution",
};

function setup({ token = true, captcha = true } = {}) {
  return {
    verifyToken: vi.fn(async () => token),
    verifyCaptcha: vi.fn(async () => captcha),
    send: vi.fn(async () => {}),
  };
}

describe("handleContact", () => {
  test("sends the message when the token and captcha are valid", async () => {
    const deps = setup();

    expect(await handleContact(input, deps)).toBe("sent");
    expect(deps.verifyToken).toHaveBeenCalledWith("token");
    expect(deps.verifyCaptcha).toHaveBeenCalledWith("solution");
    expect(deps.send).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello",
    });
  });

  test("reports success without verifying or sending when the honeypot is filled", async () => {
    const deps = setup();

    expect(await handleContact({ ...input, website: "https://spam.example" }, deps)).toBe("sent");
    expect(deps.verifyCaptcha).not.toHaveBeenCalled();
    expect(deps.send).not.toHaveBeenCalled();
  });

  test("rejects without spending the captcha when the token is invalid", async () => {
    const deps = setup({ token: false });

    expect(await handleContact(input, deps)).toBe("rejected");
    expect(deps.verifyCaptcha).not.toHaveBeenCalled();
    expect(deps.send).not.toHaveBeenCalled();
  });

  test("rejects without sending when the captcha is invalid", async () => {
    const deps = setup({ captcha: false });

    expect(await handleContact(input, deps)).toBe("rejected");
    expect(deps.send).not.toHaveBeenCalled();
  });
});
