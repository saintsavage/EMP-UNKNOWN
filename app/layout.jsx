import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://emp-unknown.vercel.app"),
  title: {
    default: "EMP UNKNOWN | Anonymous Messages",
    template: "%s | EMP UNKNOWN",
  },
  description: "Send an anonymous message to EMP and wait for a review. Private words. Unknown voices.",
  applicationName: "EMP UNKNOWN",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "EMP UNKNOWN",
    description: "Send an anonymous message to EMP and wait for a review.",
    siteName: "EMP UNKNOWN",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "EMP UNKNOWN — Private words. Unknown voices." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EMP UNKNOWN",
    description: "Send an anonymous message to EMP and wait for a review.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
