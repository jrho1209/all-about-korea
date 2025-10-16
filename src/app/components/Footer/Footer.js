import Link from "next/link";

export default function Footer() {
  return (
    <footer 
      className="text-white"
      style={{
        background: 'linear-gradient(to bottom, #000000 0%, #1a1a1a 100%)'
      }}
    >
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-black mb-4" style={{color: '#B71C1C'}}>
              Dol-E
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{color: '#8D6E63'}}>
              Perfect platform for Korea travel enthusiasts. Create special cultural exchanges and unforgettable experiences with authentic Korean locals.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold mb-6" style={{color: '#F8F4EC'}}>Explore</h4>
            <nav className="space-y-3">
              <Link href="/about" className="block hover:opacity-80 transition-colors text-sm" style={{color: '#8D6E63'}}>
                About
              </Link>
              <Link href="/agencies" className="block hover:opacity-80 transition-colors text-sm" style={{color: '#8D6E63'}}>
                Travel Buddies
              </Link>
              <Link href="/food" className="block hover:opacity-80 transition-colors text-sm" style={{color: '#8D6E63'}}>
                Food Experts
              </Link>
              <Link href="/signup" className="block hover:opacity-80 transition-colors text-sm" style={{color: '#8D6E63'}}>
                Become a Local Friend
              </Link>
              <Link href="/login" className="block hover:opacity-80 transition-colors text-sm" style={{color: '#8D6E63'}}>
                Login
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold mb-6" style={{color: '#F8F4EC'}}>Services</h4>
            <div className="space-y-3">
              <div className="text-sm flex items-center" style={{color: '#8D6E63'}}>
                <span className="mr-2">🤝</span>
                Local Friend Matching
              </div>
              <div className="text-sm flex items-center" style={{color: '#8D6E63'}}>
                <span className="mr-2">🌏</span>
                Cultural Exchange
              </div>
              <div className="text-sm flex items-center" style={{color: '#8D6E63'}}>
                <span className="mr-2">⭐</span>
                Authentic Experiences
              </div>
              <div className="text-sm flex items-center" style={{color: '#8D6E63'}}>
                <span className="mr-2">🗺️</span>
                Hidden Gems Tours
              </div>
              <div className="text-sm flex items-center" style={{color: '#8D6E63'}}>
                <span className="mr-2">🏛️</span>
                Daejeon Adventures
              </div>
            </div>
          </div>

          {/* Contact Me Section */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold mb-6" style={{color: '#F8F4EC'}}>Contact Us</h4>
            <div className="space-y-4">
              <div className="text-sm" style={{color: '#8D6E63'}}>
                <span className="block font-semibold mb-1" style={{color: '#F8F4EC'}}>Dol-E Team</span>
                Trusted Korea travel platform for international visitors
              </div>
              
              <div className="space-y-3">
                <a 
                  href="mailto:hello@allaboutkorea.com" 
                  className="flex items-center hover:opacity-80 transition-colors text-sm group"
                  style={{color: '#8D6E63'}}
                >
                  <span className="mr-3 text-lg group-hover:scale-110 transition-transform">📧</span>
                  hello@allaboutkorea.com
                </a>
                
                <div className="flex items-center text-sm" style={{color: '#8D6E63'}}>
                  <span className="mr-3 text-lg">🌏</span>
                  Daejeon, South Korea
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div 
        className="py-6"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm" style={{color: '#8D6E63'}}>
              &copy; {new Date().getFullYear()} Dol-E. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="hover:opacity-80 transition-colors" style={{color: '#8D6E63'}}>
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:opacity-80 transition-colors" style={{color: '#8D6E63'}}>
                Terms of Service
              </Link>
              <span style={{color: '#8D6E63'}}>
                Made with ❤️ for Korea Travel Enthusiasts
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}