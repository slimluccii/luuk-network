export type ContactMessage = { name: string; email: string; message: string };
type MailConfig = { token: string; sender: string; recipient: string };

export async function sendContactMessage(
  { name, email, message }: ContactMessage,
  { token, sender, recipient }: MailConfig,
) {
  const response = await fetch("https://api.lettermint.co/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-lettermint-token": token },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: [email],
      subject: `Contact form: ${name}`,
      text: `${name} <${email}>\n\n${message}`,
    }),
  });
  if (!response.ok) {
    throw new Error(`Sending the contact message failed with status ${response.status}`);
  }
}
