import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";

export const metadata: Metadata = {
  title: "Deadline Desk",
  description: "Your simple deadline list with only the reminders you need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-main-text bg-background antialiased w-full overflow-x-hidden flex justify-center flex-col`}
      >
        <div className="flex w-full flex-col">{children}</div>
      </body>
    </html>
  );
}
