import PageHero from "../components/PageHero/PageHero";

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <PageHero />

      {/* Platform Introduction */}
      <section className="py-20 bg-white text-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
              Daejeon Travel <span className="text-red-500">Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A trusted platform connecting international travelers with verified local travel agencies in Daejeon. 
              Experience safe and extraordinary journeys through Korea's science and technology hub.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {/* Mission */}
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To help international travelers discover the hidden gems of Daejeon and connect them 
                safely and conveniently with local travel agencies.
              </p>
            </div>

            {/* Vision */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔮</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the leading travel platform for Daejeon, contributing to elevating 
                the city's status as an international tourist destination.
              </p>
            </div>

            {/* Values */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                We prioritize transparency, reliability, and customer satisfaction, 
                building an ecosystem where all stakeholders can win together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works?
            </h2>
            <p className="text-xl text-gray-600">
              Plan your perfect Daejeon trip in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Browse Agencies</h3>
              <p className="text-gray-600">
                Explore verified local travel agencies in Daejeon and 
                check their services and specialties.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Send Inquiry</h3>
              <p className="text-gray-600">
                Send your travel dates, group size, and 
                preferred experiences to your chosen agency.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Plan Your Trip</h3>
              <p className="text-gray-600">
                Receive customized proposals from agencies and 
                plan your perfect Daejeon adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Agencies</h3>
              <p className="text-gray-600 text-sm">
                Only trusted travel agencies that passed rigorous screening
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Communication</h3>
              <p className="text-gray-600 text-sm">
                Intuitive platform for seamless communication with agencies
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customized Service</h3>
              <p className="text-gray-600 text-sm">
                Personalized travel plans based on your preferences
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assurance</h3>
              <p className="text-gray-600 text-sm">
                Continuous service quality management through review system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Have More Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Feel free to contact us anytime. We're here to help you create amazing memories in Daejeon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@daejeontravel.com" 
              className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Contact Us
            </a>
            <a 
              href="/agencies" 
              className="bg-white text-red-600 border-2 border-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Browse Agencies
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}