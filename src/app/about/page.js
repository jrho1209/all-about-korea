import PageHero from "../components/PageHero/PageHero";

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <PageHero />

      {/* James Profile Section */}
      <section className="py-20 bg-white text-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Profile Image & Quick Info */}
            <div className="relative">
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-blue-500 rounded-full blur-xl opacity-30"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                  <span className="text-6xl">👨‍💻</span>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-8 -right-8 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                🇰🇷 Korean
              </div>
              <div className="absolute -bottom-8 -left-8 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                🇺🇸 American
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
                Meet <span className="text-red-500">James Rho</span>
              </h2>
              
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  안녕하세요! I&apos;m James Rho, a <span className="font-bold text-red-500">Korean-American developer</span> with 
                  dual citizenship and an insatiable passion for culture. While I spend my days crafting code and building 
                  digital experiences, my heart beats for the rich tapestry of Korean culture and its global influence.
                </p>
                
                <p>
                  Growing up between two worlds has given me a unique perspective on how culture transcends borders. 
                  I&apos;m particularly <span className="font-bold text-blue-500">obsessed with food</span> – from discovering 
                  hidden gems in Seoul&apos;s alleyways to finding the perfect Korean BBQ spot in LA. Every dish tells a story, 
                  and I love sharing those stories with the world.
                </p>
                
                <p>
                  When I&apos;m not coding (always with music in my ears 🎵), you&apos;ll find me exploring nature trails, 
                  binge-watching the latest K-dramas, or analyzing the cinematography of Korean films. 
                  I believe that <span className="font-bold text-purple-500">culture is the bridge</span> that connects 
                  us all, and through K-Everything, I want to share that bridge with you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interests Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-16">
            My <span className="text-red-500">Passions</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Food */}
            <div className="group h-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-red-500 h-full flex flex-col">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🍜</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Food Culture</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  From street food to fine dining, exploring the authentic flavors that define Korean cuisine and sharing hidden culinary gems.
                </p>
              </div>
            </div>

            {/* Nature */}
            <div className="group h-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-green-500 h-full flex flex-col">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌲</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nature</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  Finding inspiration in Korea&apos;s beautiful landscapes, from Jeju&apos;s coastlines to the mountains of Seoraksan.
                </p>
              </div>
            </div>

            {/* Music & Development */}
            <div className="group h-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-purple-500 h-full flex flex-col">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎵</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Music & Code</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  Coding with K-pop, indie, and lo-fi beats. Music fuels creativity and makes every development session better.
                </p>
              </div>
            </div>

            {/* Entertainment */}
            <div className="group h-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-blue-500 h-full flex flex-col">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Films & Dramas</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  Analyzing the storytelling mastery of Korean cinema and the emotional depth of K-dramas during downtime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8">
            The <span className="text-red-400">K-Everything</span> Mission
          </h2>
          
          <p className="text-xl md:text-2xl leading-relaxed text-gray-300 mb-12">
            To bridge cultures through authentic storytelling, connecting global audiences with the heart and soul of Korean culture. 
            Every post, every recommendation, every story is crafted to inspire curiosity and foster genuine appreciation 
            for the beautiful complexity of Korean culture.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Global Community</h3>
              <p className="text-gray-400 text-sm">Connecting cultures across continents</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">Authentic Stories</h3>
              <p className="text-gray-400 text-sm">Real experiences, genuine recommendations</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Cultural Bridge</h3>
              <p className="text-gray-400 text-sm">Making Korean culture accessible to everyone</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}