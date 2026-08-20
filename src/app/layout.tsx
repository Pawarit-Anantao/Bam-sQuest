import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bam's Quest",
  description: "An interactive 2D RPG adventure game with visual novel dialogue and quiz-based combat.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${notoSansThai.variable} h-full`}>
      <head>
        <Script
          id="prevent-double-tap-zoom"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('dblclick', function(e) {
                e.preventDefault();
              }, { passive: false });
            `,
          }}
        />
      </head>
      <body
        className="min-h-full bg-white overflow-hidden"
        style={{ fontFamily: "var(--font-noto-thai), 'Noto Sans Thai', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
