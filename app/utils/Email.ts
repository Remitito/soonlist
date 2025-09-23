import { NextResponse } from "next/server";
import { Resend } from "resend";

export interface EmailTask {
  description: string;
  daysUntil: number;
}

export async function sendEmail(
  name: string,
  email: string,
  tasks: EmailTask[]
) {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const taskSummary = tasks?.length
    ? tasks
        .map(
          (task) =>
            `<li style="margin-bottom: 8px; color: #8B5A3C;">${
              task.description
            } <span style="color: #A67C5A;">(in ${task.daysUntil} day${
              task.daysUntil === 1 ? "" : "s"
            })</span></li>`
        )
        .join("")
    : `<li style="color: #A67C5A;">No tasks listed</li>`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_SERVER_SENDER!,
      to: email,
      subject: `Deadline Desk Reminders for ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FDFCF8; color: #8B5A3C; padding: 20px; border-radius: 10px;">
          <h2 style="color: #8B5A3C;">Hey ${name},</h2>
          <p style="font-size: 16px; color: #8B5A3C;">Here are your upcoming task reminders:</p>
          <ul style="padding-left: 20px; font-size: 15px;">${taskSummary}</ul>
          <p style="font-size: 16px; color: #8B5A3C;">Thanks for using Deadline Desk!</p>
        </div>
      `,
    });
    return new NextResponse(JSON.stringify("Success"), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new NextResponse(JSON.stringify("Error sending email"), {
      status: 500,
    });
  }
}
