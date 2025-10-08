import PageHero from "../components/PageHero/PageHero";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white">
      <PageHero />

      {/* Platform Introduction */}
      <section className="py-20 text-gray-900" style={{backgroundColor: '#F8F4EC'}}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-8" style={{color: '#B71C1C'}}>
              Tour Mate <span style={{color: '#2E2E2E'}}>Platform</span>
            </h2>
            <p className="text-xl max-w-4xl mx-auto leading-relaxed" style={{color: '#8D6E63'}}>
              A trusted platform connecting international travelers with local friends and cultural guides. 
              Experience authentic Korean culture and build meaningful friendships beyond traditional tourism.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {/* Mission */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#B71C1C'}}>
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#2E2E2E'}}>Our Mission</h3>
              <p className="leading-relaxed" style={{color: '#8D6E63'}}>
                To help international travelers discover authentic Korean culture and connect them 
                with local friends who can provide genuine cultural experiences and lasting friendships.
              </p>
            </div>

            {/* Vision */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#5C7F9A'}}>
                <span className="text-3xl">🔮</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#2E2E2E'}}>Our Vision</h3>
              <p className="leading-relaxed" style={{color: '#8D6E63'}}>
                To become the leading cultural exchange platform for Korea, fostering meaningful 
                connections between international travelers and local communities.
              </p>
            </div>

            {/* Values */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#EF6C00'}}>
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#2E2E2E'}}>Our Values</h3>
              <p className="leading-relaxed" style={{color: '#8D6E63'}}>
                We prioritize authenticity, cultural respect, and meaningful connections, 
                building bridges between cultures through genuine friendship and understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" style={{backgroundColor: '#2E2E2E'}}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{color: '#F8F4EC'}}>
              How It Works?
            </h2>
            <p className="text-xl" style={{color: '#8D6E63'}}>
              Connect with your Korean tour mate in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#B71C1C'}}>
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{color: '#F8F4EC'}}>Browse Tour Mates</h3>
              <p style={{color: '#8D6E63'}}>
                Explore verified local friends who can show you authentic Korean culture 
                and share their favorite hidden spots.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#5C7F9A'}}>
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{color: '#F8F4EC'}}>Connect & Chat</h3>
              <p style={{color: '#8D6E63'}}>
                Send messages about your interests, travel dates, and 
                what kind of authentic experiences you're looking for.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#EF6C00'}}>
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4" style={{color: '#F8F4EC'}}>Experience Together</h3>
              <p style={{color: '#8D6E63'}}>
                Meet your tour mate and explore Korea like a local, 
                creating genuine friendships and unforgettable memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20" style={{backgroundColor: '#F8F4EC'}}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{color: '#B71C1C'}}>
              Why Choose Tour Mate?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#B71C1C'}}>
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{color: '#2E2E2E'}}>Verified Friends</h3>
              <p className="text-sm" style={{color: '#8D6E63'}}>
                Only trusted locals who passed our community screening process
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#5C7F9A'}}>
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{color: '#2E2E2E'}}>Easy Communication</h3>
              <p className="text-sm" style={{color: '#8D6E63'}}>
                Chat directly with your tour mate in your preferred language
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#FFCB05'}}>
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{color: '#2E2E2E'}}>Authentic Experiences</h3>
              <p className="text-sm" style={{color: '#8D6E63'}}>
                Local insights and hidden gems you won't find in guidebooks
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#EF6C00'}}>
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{color: '#2E2E2E'}}>Cultural Exchange</h3>
              <p className="text-sm" style={{color: '#8D6E63'}}>
                Learn Korean culture while sharing your own background
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20" style={{backgroundColor: '#2E2E2E'}}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8" style={{color: '#F8F4EC'}}>
            Ready to Find Your Tour Mate?
          </h2>
          <p className="text-xl mb-8" style={{color: '#8D6E63'}}>
            Join our community and start building meaningful connections with Korean locals today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@tourmatekorea.com" 
              className="px-8 py-4 rounded-lg text-lg font-semibold transition-colors text-white hover:opacity-90"
              style={{backgroundColor: '#B71C1C'}}
            >
              Contact Us
            </a>
            <Link 
              href="/signup" 
              className="px-8 py-4 rounded-lg text-lg font-semibold transition-colors border-2 hover:opacity-90"
              style={{backgroundColor: 'transparent', color: '#F8F4EC', borderColor: '#F8F4EC'}}
            >
              Join as Tour Mate
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}