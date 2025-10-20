import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import "@/styles/flaticon.css";
import "@/styles/font-awesome.min.css";
import "@/styles/themify-icons.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from "./providers";
import { getLocale } from 'next-intl/server';

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "ChainCharity Lottery",
  description: "ChainCharity Lottery",
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${sora.variable} antialiased font-sans`}>
        <div className="App" id="scrool">
          <NextIntlClientProvider locale={locale}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
