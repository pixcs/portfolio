import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "John Patrick Papa | Front End Developer",
  description: "Portfolio of John Patrick Papa, front end developer",
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
      <body className={`${inter.className} text-gray-600  dark:text-white dark:bg-slate-950 transition-theme`}>
        {children}
        <footer>
          <p className=" text-sm md:text-base flex items-center justify-center text-wrap dark:text-gray-400 px-8 py-6">
            © 2024 | Designed by Sagar Shah and coded by ❤️ John Patrick Papa
          </p>
        </footer>
      </body>
    </html>
  );
}
