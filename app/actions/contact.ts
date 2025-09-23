"use server";

import { Resend } from "resend";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required" };
  }

  try {
    await sendContactEmail(name, email, message);
    return { success: true };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

async function sendContactEmail(name: string, email: string, message: string) {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  await resend.emails.send({
    from: process.env.EMAIL_SERVER_SENDER!,
    to: process.env.EMAIL_SERVER_RECEIVER!,
    subject: `New Contact Form Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #FDFCF8; color: #8B5A3C; padding: 20px; border-radius: 10px;">
        <h2 style="color: #8B5A3C;">New Contact Form Submission</h2>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #8B5A3C;"><strong>From:</strong> ${name}</p>
          <p style="margin: 0 0 10px 0; color: #8B5A3C;"><strong>Email:</strong> ${email}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #8B5A3C; margin-bottom: 10px;">Message:</h3>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #8B5A3C; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; color: #8B5A3C;">${message}</p>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="font-size: 14px; color: #8B5A3C;">This message was sent through your website's contact form.</p>
      </div>
    `,
    text: `
New Contact Form Submission

From: ${name}
Email: ${email}

Message:
${message}

---
This message was sent through your website's contact form.
    `,
  });
}
