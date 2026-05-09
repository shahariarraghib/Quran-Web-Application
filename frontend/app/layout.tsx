import {
  Amiri,
  Lateef,
  Noto_Naskh_Arabic,
  Plus_Jakarta_Sans,
  Scheherazade_New,
} from "next/font/google";
import "./globals.css";
import AppFrame from "../components/AppFrame";
import { SettingsProvider } from "../context/SettingsContext";
import { getSurahList } from "../utils/api";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const scheherazade = Scheherazade_New({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-scheherazade",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-naskh",
});

const lateef = Lateef({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-lateef",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const surahs = await getSurahList();

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${plusJakarta.variable} ${amiri.variable} ${scheherazade.variable} ${notoNaskh.variable} ${lateef.variable}`}
      >
        <SettingsProvider>
          <AppFrame surahs={surahs}>{children}</AppFrame>
        </SettingsProvider>
      </body>
    </html>
  );
}
