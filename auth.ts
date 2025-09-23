import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import clientPromise from "./lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Resend } from "resend";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google,
    Nodemailer({
      id: "email",
      server: {
        host: "smtp.resend.com",
        port: 587,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY!,
        },
      },
      from: process.env.EMAIL_SERVER_SENDER!,
      sendVerificationRequest: async ({ identifier, url }) => {
        const resend = new Resend(process.env.RESEND_API_KEY!);

        await resend.emails.send({
          from: process.env.EMAIL_SERVER_SENDER!,
          to: identifier,
          subject: "Sign in to Deadline Desk",
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #FDFCF8; color: #8B5A3C; padding: 20px; text-align: center; border-radius: 10px;">
              <h1 style="color: #8B5A3C;">Welcome to Deadline Desk</h1>
              <p style="color: #8B5A3C;">Hello,</p>
              <p style="color: #8B5A3C;">
                Please click the button below to sign in:
              </p>
              <a href="${url}" style="display: inline-block; background-color: #8B5A3C; color: #FDFCF8; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">
                Sign in to Deadline Desk
              </a>
              <p style="margin-top: 20px; color: #8B5A3C; font-size: 0.9em;">
                If you didn't request this email, you can safely ignore it.
              </p>
              <footer style="margin-top: 30px; color: #8B5A3C; font-size: 0.8em;">
                <p>Thank you</p>
              </footer>
            </div>
          `,
          text: `Sign in to Deadline Desk\n\nClick the link below to sign in:\n\n${url}\n\nIf you didn't request this email, you can safely ignore it.`,
        });
      },
    }),
  ],
});
