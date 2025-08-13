import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";
import { Analytics } from "@vercel/analytics/react";
import { auth } from "@/auth";
import Navbar from "./(components)/Navbar";

export const metadata: Metadata = {
  title: "Deadline Desk",
  description: "Your simple deadline list with only the reminders you need.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${inter.className} text-main-text bg-background antialiased w-full overflow-x-hidden flex justify-center flex-col`}
      >
        <div className="w-full flex flex-col justify-center items-center">
          <Navbar
            email={session?.user?.email || ""}
            loggedIn={session ? true : false}
          />
          <div className="flex w-full flex-col">{children}</div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
