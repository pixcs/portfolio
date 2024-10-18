import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <link rel="icon" href="https://avatars.githubusercontent.com/u/121350861?s=400&u=e183ab30fa88f3ff949d997fdb717e38593d367e&v=4" />
      <body className={`${inter.className} text-gray-600 dark:text-white dark:bg-slate-950 transition-theme`}>
        {children}
      </body>
    </html>
  );
}
