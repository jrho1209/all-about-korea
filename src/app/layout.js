import SessionProviderWrapper from "./components/Providers/SessionProviderWrapper";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

export const metadata = {
  title: "Daejeon Travel Platform",
  description: "Connect with trusted local travel agencies in Daejeon - Experience safe and extraordinary journeys through Korea's science city",
  icons: {
    icon: [
      { url: '/logo/brandicon.png?v=3', sizes: '32x32', type: 'image/png' },
      { url: '/logo/brandicon.png?v=3', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/logo/brandicon.png?v=3',
    apple: '/logo/brandicon.png?v=3',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo/brandicon.png?v=3',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <SessionProviderWrapper>
          <Navbar />
          <div>
            {children}
          </div>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
