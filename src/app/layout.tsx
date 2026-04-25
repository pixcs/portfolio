import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "John Patrick Papa | Software Developer",
  description: "Portfolio of John Patrick Papa, Software Developer",
  icons: "https://i.pinimg.com/564x/99/96/c8/9996c806c207dbc3028038d54c72420d.jpg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${inter.className} text-gray-600 dark:text-white dark:bg-slate-950 transition-theme`}
      >
        <NextTopLoader
          color="linear-gradient(to right,#06b6d4,#3b82f6)"
          height={3}
          showSpinner={false}
          crawl={true}
          easing="ease"
          speed={200}
        />
        {children}
      </body>
    </html>
  );
}