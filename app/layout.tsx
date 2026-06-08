import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mikura",
  description: "미쿠라 포토 다운로드",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, background: "#fdf0f6", fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
