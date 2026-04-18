import { Amiri, Plus_Jakarta_Sans, Scheherazade_New } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { SettingsProvider } from "../context/SettingsContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${plusJakarta.variable} ${amiri.variable} ${scheherazade.variable}`}
      >
        <SettingsProvider>
          <div className="min-h-screen lg:pl-[18.5rem]">
            <Sidebar />
            <main className="min-h-screen px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:pt-10">
              {children}
            </main>
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}
