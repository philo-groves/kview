import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import Header from "./_components/header/header";
import Content from "./_components/content";
import { ThemeProvider } from "./_components/theme-provider";
import { global_font } from "./fonts";
import { ResultsProvider } from "./_components/results-provider";
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
    title: "kview",
    description: "Test Result Viewer for KTest"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`h-screen overflow-hidden ${global_font.className}`}>
        <Suspense>
          <ThemeProvider>
            <ResultsProvider>
              <Header />
              <Content>{children}</Content>
            </ResultsProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
