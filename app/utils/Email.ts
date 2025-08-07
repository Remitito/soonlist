import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export interface EmailTask {
  description: string;
  daysUntil: number;
}

export async function sendEmail(
  name: string,
  email: string,
  tasks: EmailTask[]
) {
  const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const taskSummary = tasks?.length
    ? tasks
        .map(
          (task) =>
            `<li style="margin-bottom: 8px;">${
              task.description
            } <span style="color: #888;">(in ${task.daysUntil} day${
              task.daysUntil === 1 ? "" : "s"
            })</span></li>`
        )
        .join("")
    : `<li style="color: #888;">No tasks listed</li>`;

  const mailOptions = {
    from: process.env.EMAIL_SERVER_USER,
    to: email,
    subject: `Soonlist Reminders for ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #0057D9;">Hey ${name},</h2>
        <p style="font-size: 16px;">Here are your upcoming task reminders:</p>
        <ul style="padding-left: 20px; font-size: 15px;">${taskSummary}</ul>
          <p style="font-size: 16px;">Thanks for using Soonlist!</p>

      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new NextResponse(JSON.stringify("Success"), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new NextResponse(JSON.stringify("Error sending email"), {
      status: 500,
    });
  }
}
