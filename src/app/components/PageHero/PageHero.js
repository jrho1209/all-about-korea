"use client";
import { usePathname } from "next/navigation";

const pageConfig = {
  "/": {
    title: "K-Everything",
    subtitle: "Where Korean Culture Meets Global Curiosity",
    gradient: "from-red-500 via-pink-500 to-orange-500",
    bgGradient: "from-slate-900 via-purple-900 to-slate-900",
    emoji: "🇰🇷"
  },
  "/about": {
    title: "All About Korea",
    subtitle: "Meet James Rho - Korean-American Developer & Culture Enthusiast",
    gradient: "from-blue-500 via-purple-500 to-pink-500",
    bgGradient: "from-slate-900 via-blue-900 to-slate-900",
    emoji: "👨‍💻"
  },
  "/food": {
    title: "Korean Food",
    subtitle: "Discover Authentic Flavors & Hidden Local Gems",
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    bgGradient: "from-orange-900 via-red-900 to-pink-900",
    emoji: "🍜"
  },
  "/drama": {
    title: "K-Drama",
    subtitle: "Explore the Emotional World of Korean Dramas",
    gradient: "from-purple-500 via-pink-500 to-red-500",
    bgGradient: "from-purple-900 via-pink-900 to-red-900",
    emoji: "📺"
  },
  "/movies": {
    title: "K-Movie",
    subtitle: "Cinematic Masterpieces from Korea",
    gradient: "from-gray-500 via-purple-500 to-blue-500",
    bgGradient: "from-gray-900 via-purple-900 to-blue-900",
    emoji: "🎬"
  },
  "/music": {
    title: "K-Music",
    subtitle: "From K-Pop to Indie - Korean Music Universe",
    gradient: "from-pink-500 via-red-500 to-orange-500",
    bgGradient: "from-pink-900 via-red-900 to-orange-900",
    emoji: "🎵"
  },
  "/travel": {
    title: "Travel",
    subtitle: "Beautiful Korea - Hidden Places & Cultural Destinations",
    gradient: "from-green-500 via-blue-500 to-purple-500",
    bgGradient: "from-green-900 via-blue-900 to-purple-900",
    emoji: "✈️"
  },
  "/login": {
    title: "Welcome Back",
    subtitle: "Login to Access K-Everything Content",
    gradient: "from-gray-500 via-slate-500 to-gray-500",
    bgGradient: "from-gray-900 via-slate-900 to-gray-900",
    emoji: "🔐"
  }
};

export default function PageHero({ customTitle, customSubtitle }) {
  const pathname = usePathname();
  
  // 동적 라우트 처리 (예: /food/[slug])
  const basePath = pathname.split('/').slice(0, 2).join('/') || '/';
  
  const config = pageConfig[basePath] || {
    title: "K-Everything",
    subtitle: "Exploring Korean Culture",
    gradient: "from-red-500 via-pink-500 to-orange-500",
    bgGradient: "from-slate-900 via-purple-900 to-slate-900",
    emoji: "🇰🇷"
  };

  const title = customTitle || config.title;
  const subtitle = customSubtitle || config.subtitle;

  return (
    <section className={`relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br ${config.bgGradient} text-white overflow-hidden`}>
      {/* Floating Elements - 느린 회전과 떠오르는 효과 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-white/4 rounded-full blur-3xl animate-float-slower delay-1000"></div>
        <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-white/2 rounded-full blur-2xl animate-float-reverse"></div>
      </div>

      {/* Gradient Overlay Animation */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-10 animate-gradient-shift`}></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Emoji with hover scale */}
        <div className="text-6xl md:text-7xl mb-6 hover:scale-110 transition-transform duration-300 cursor-pointer">
          {config.emoji}
        </div>
        
        {/* Title with stagger animation */}
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent leading-tight animate-fade-in-up`}>
          {title}
        </h1>
        
        {/* Subtitle with delayed animation */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up delay-300">
          {subtitle}
        </p>
        
        {/* Animated Line */}
        <div className={`w-0 h-1 bg-gradient-to-r ${config.gradient} mx-auto mt-8 rounded-full animate-expand-line`}></div>
      </div>

      {/* Smooth scroll indicator - 완전 중앙 정렬 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float-gentle">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center items-start pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-scroll-indicator"></div>
          </div>
          <span className="text-xs text-white/50 font-light">Scroll</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(25px) rotate(360deg); }
        }
        @keyframes gradient-shift {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes expand-line {
          0% { width: 0; }
          100% { width: 6rem; }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes scroll-indicator {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(16px); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 10s ease-in-out infinite; }
        .animate-gradient-shift { animation: gradient-shift 6s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-expand-line { animation: expand-line 1.2s ease-out 0.5s forwards; }
        .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
        .animate-scroll-indicator { animation: scroll-indicator 2s ease-in-out infinite; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </section>
  );
}