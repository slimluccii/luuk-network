type CaptchaConfig = { apiKey: string; sitekey: string };

export async function verifyCaptcha(solution: string, { apiKey, sitekey }: CaptchaConfig) {
  try {
    const response = await fetch("https://global.frcapi.com/api/v2/captcha/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body: JSON.stringify({ response: solution, sitekey }),
    });
    if (!response.ok) {
      console.error(`Captcha verification failed with status ${response.status}`);
      return false;
    }
    const result: { success?: unknown } = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Captcha verification failed", error);
    return false;
  }
}
