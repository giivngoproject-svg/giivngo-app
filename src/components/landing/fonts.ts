import { Poppins } from "next/font/google";

// Heading font, scoped to the landing page only (applied via the
// `poppins.variable` class on the page wrapper — never set globally).
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});
