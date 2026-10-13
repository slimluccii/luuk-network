const minAge = 3 * 1000;
const maxAge = 2 * 60 * 60 * 1000;
const encoder = new TextEncoder();

function importKey(secret: string, usage: "sign" | "verify") {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

export async function createFormToken(secret: string, now = Date.now()): Promise<string> {
  const key = await importKey(secret, "sign");
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(String(now)));
  return `${now}.${Buffer.from(signature).toString("base64url")}`;
}

export async function verifyFormToken(
  token: string,
  secret: string,
  now = Date.now(),
): Promise<boolean> {
  const match = /^(\d+)\.([\w-]+)$/.exec(token);
  if (!match) return false;

  const [, issuedAt, signature] = match;
  const age = now - Number(issuedAt);
  if (age < minAge || age > maxAge) return false;

  const key = await importKey(secret, "verify");
  const bytes = Buffer.from(signature, "base64url");
  return crypto.subtle.verify("HMAC", key, bytes, encoder.encode(issuedAt));
}
