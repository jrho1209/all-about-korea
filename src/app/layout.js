import SessionProviderWrapper from "./components/Providers/SessionProviderWrapper";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

export const metadata = {
  title: "Dol-E - Korea Travel Agent",
  description: "Connect with authentic Korean locals for special travel experiences - Your perfect platform for Korea travel enthusiasts",
  icons: {
    icon: [
      { url: '/logo/dol-e-favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/dol-e-favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/logo/dol-e-favicon.png',
    apple: '/logo/dol-e-favicon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo/dol-e-favicon.png',
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
