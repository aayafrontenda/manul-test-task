import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DataProvider } from "./context/DataContext";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Тестовое задание",
  description: "Выполнено для компании Manul",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <DataProvider>
        <body
          className={`${inter.className} flex flex-col justify-center p-4 lg:p-8 w-full h-full bg-gray-100 overflow-x-hidden`}
        >
          {children}
        </body>
      </DataProvider>
    </html>
  );
}
