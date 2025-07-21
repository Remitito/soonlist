import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";

export const metadata: Metadata = {
  title: "Soonlist",
  description: "Your simple deadline list with just the reminders you need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-main-text bg-background antialiased w-screen flex justify-center flex-col`}
      >
        <div className="flex w-full justify-center">{children}</div>
      </body>
    </html>
  );
}
