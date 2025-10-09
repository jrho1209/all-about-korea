import Image from "next/image";
import Hero from "./components/Hero/Hero";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Hero />
      
      {/* 서비스 소개 섹션 */}
      <section className="py-8 md:py-16" style={{backgroundColor: '#F8F4EC'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4" style={{color: '#2E2E2E'}}>
              Why Choose Our Tour Mate Platform?
            </h2>
            <p className="text-sm md:text-xl max-w-3xl mx-auto" style={{color: '#8D6E63'}}>
              Beyond ordinary city tours - Connect with local mates for authentic cultural exchange and lifelong friendships.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4" style={{backgroundColor: '#5C7F9A'}}>
                <span className="text-lg md:text-2xl">🤝</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3" style={{color: '#2E2E2E'}}>Make Local Friends</h3>
              <p className="text-sm md:text-base" style={{color: '#8D6E63'}}>
                Connect with passionate locals who become your travel mates, not just guides. Build real friendships beyond tourism.
              </p>
            </div>
            
            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4" style={{backgroundColor: '#5C7F9A'}}>
                <span className="text-white text-base md:text-xl font-bold">문</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3" style={{color: '#2E2E2E'}}>Cultural Exchange</h3>
              <p className="text-sm md:text-base" style={{color: '#8D6E63'}}>
                Share stories, traditions, and experiences. Learn Korean culture while sharing yours in meaningful conversations.
              </p>
            </div>
            
            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4" style={{backgroundColor: '#5C7F9A'}}>
                <span className="text-lg md:text-2xl">⭐</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3" style={{color: '#2E2E2E'}}>Authentic Experiences</h3>
              <p className="text-sm md:text-base" style={{color: '#8D6E63'}}>
                Skip tourist traps! Experience Daejeon like a local through genuine connections and hidden gems only mates know.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-8 md:py-16" style={{backgroundColor: '#2E2E2E'}}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            Start Your Daejeon Adventure Today!
          </h2>
          <p className="text-sm md:text-xl mb-6 md:mb-8" style={{color: '#F8F4EC'}}>
            Plan your special Daejeon journey with our verified travel agencies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
            <Link 
              href="/agencies"
              className="px-6 py-3 md:px-8 md:py-4 rounded-lg text-sm md:text-lg font-semibold transition-colors text-white hover:opacity-90"
              style={{backgroundColor: '#B71C1C'}}
            >
              Browse Agencies
            </Link>
            <Link 
              href="/signup"
              className="px-6 py-3 md:px-8 md:py-4 rounded-lg text-sm md:text-lg font-semibold border-2 transition-colors hover:opacity-90 text-white"
              style={{
                backgroundColor: '#5C7F9A', 
                borderColor: '#5C7F9A'
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
