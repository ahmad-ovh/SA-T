import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROJECT SAN ANDREAS | The Ground Beneath Us",
  description: "A fictional educational geological archive exploring the San Andreas transform boundary and its relevance to Malaysia."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
