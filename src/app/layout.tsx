import type { Metadata } from "next";
import "./globals.css";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { GlobalProvider } from "@/store/Global";
import UserSigned from "@/utils/UserSigned";

const interFont = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bricolageGrotesque = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage-grotesque" })

export const metadata: Metadata = {
  title: "Ecommerce App",
  description: "Um ecommerce criado com Next e Node",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${bricolageGrotesque.variable} ${interFont.variable}  antialiased`}
      >
        <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
          <GlobalProvider />
          {children}
          <UserSigned />
        </ThemeProvider>
      </body>
    </html>
  );
}
