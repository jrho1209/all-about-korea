import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              K-Everything
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Bridging Korean culture with global curiosity. 
              Discover authentic stories, flavors, and experiences.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-lg hover:bg-red-500 transition-colors cursor-pointer">
                🇰🇷
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-lg hover:bg-gray-700 transition-colors cursor-pointer">
                🌍
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold mb-6 text-white">Explore</h4>
            <nav className="space-y-3">
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors text-sm">
                About
              </Link>
              <Link href="/food" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Korean Food
              </Link>
              <Link href="/drama" className="block text-gray-400 hover:text-white transition-colors text-sm">
                K-Drama
              </Link>
              <Link href="/movies" className="block text-gray-400 hover:text-white transition-colors text-sm">
                K-Movies
              </Link>
              <Link href="/music" className="block text-gray-400 hover:text-white transition-colors text-sm">
                K-Music
              </Link>
              <Link href="/travel" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Travel
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold mb-6 text-white">Categories</h4>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm flex items-center">
                <span className="mr-2">🍜</span>
                Local Restaurants
              </div>
              <div className="text-gray-400 text-sm flex items-center">
                <span className="mr-2">📺</span>
                Drama Reviews
              </div>
              <div className="text-gray-400 text-sm flex items-center">
                <span className="mr-2">🎬</span>
                Film Analysis
              </div>
              <div className="text-gray-400 text-sm flex items-center">
                <span className="mr-2">🎵</span>
                Music Discovery
              </div>
              <div className="text-gray-400 text-sm flex items-center">
                <span className="mr-2">✈️</span>
                Travel Guides
              </div>
            </div>
          </div>

          {/* Contact Me Section */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold mb-6 text-white">Contact Me</h4>
            <div className="space-y-4">
              <div className="text-gray-400 text-sm">
                <span className="block font-semibold text-white mb-1">James Rho</span>
                Korean-American Developer & Culture Enthusiast
              </div>
              
              <div className="space-y-3">
                <a 
                  href="mailto:james@k-everything.com" 
                  className="flex items-center text-gray-400 hover:text-white transition-colors text-sm group"
                >
                  <span className="mr-3 text-lg group-hover:scale-110 transition-transform">📧</span>
                  james@k-everything.com
                </a>
                
                <div className="flex items-center text-gray-400 text-sm">
                  <span className="mr-3 text-lg">🌏</span>
                  Daejeon, South Korea & Denver, USA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} All About Korea by James Rho. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-500">
                Made with ❤️ for Korean Culture
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}