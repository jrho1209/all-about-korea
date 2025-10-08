import SessionProviderWrapper from "./components/Providers/SessionProviderWrapper";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Daejeon Travel Platform",
  description: "Connect with trusted local travel agencies in Daejeon - Experience safe and extraordinary journeys through Korea's science city",
  icons: {
    icon: [
      { url: '/logo/brandicon.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/logo/brandicon.png?v=2', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/logo/brandicon.png?v=2',
    apple: '/logo/brandicon.png?v=2',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo/brandicon.png?v=2',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <Navbar />
          <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
          </div>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
