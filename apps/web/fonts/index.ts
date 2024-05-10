import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";

export const fontSans = GeistSans;

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});
