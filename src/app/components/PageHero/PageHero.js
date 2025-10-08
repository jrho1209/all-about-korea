"use client";
import { usePathname } from "next/navigation";

const pageConfig = {
  "/": {
    title: "All About Korea",
    subtitle: "Tour Mate Platform - Connect with Korean Culture",
    gradient: "from-red-300 via-orange-200 to-yellow-200",
    bgGradient: "#D4C4A8",
    emoji: "🇰🇷"
  },
  "/about": {
    title: "About Tour Mate",
    subtitle: "Building Cultural Bridges Through Authentic Friendships",
    gradient: "from-blue-300 via-slate-300 to-red-300",
    bgGradient: "#D4C4A8",
    emoji: "👨‍💻"
  },
  "/agencies": {
    title: "Tour Mates",
    subtitle: "Connect with Verified Local Cultural Guides",
    gradient: "from-red-300 via-orange-300 to-red-300",
    bgGradient: "#D4C4A8",
    emoji: "🏢"
  },
  "/food": {
    title: "Korean Food",
    subtitle: "Discover Authentic Flavors & Hidden Local Gems",
    gradient: "from-orange-300 via-yellow-300 to-orange-300",
    bgGradient: "#D4C4A8",
    emoji: "🍜"
  },
  
  "/travel": {
    title: "Travel",
    subtitle: "Beautiful Korea - Hidden Places & Cultural Destinations",
    gradient: "from-blue-300 via-slate-300 to-blue-300",
    bgGradient: "#D4C4A8",
    emoji: "✈️"
  },
  "/login": {
    title: "Welcome Back",
    subtitle: "Login to Access Tour Mate Platform",
    gradient: "from-slate-300 via-slate-200 to-slate-300",
    bgGradient: "#D4C4A8",
    emoji: "🔐"
  }
};

export default function PageHero({ customTitle, customSubtitle }) {
  const pathname = usePathname();
  
  // 동적 라우트 처리 (예: /food/[slug])
  const basePath = pathname.split('/').slice(0, 2).join('/') || '/';
  
  const config = pageConfig[basePath] || {
    title: "All About Korea",
    subtitle: "Tour Mate Platform - Korean Cultural Exchange",
    gradient: "from-red-300 via-orange-200 to-yellow-200",
    bgGradient: "#D4C4A8",
    emoji: "🇰🇷"
  };

  const title = customTitle || config.title;
  const subtitle = customSubtitle || config.subtitle;

  return (
    <section className="relative min-h-[40vh] flex items-center justify-center text-gray-800 overflow-hidden"
             style={{backgroundColor: config.bgGradient}}>
      
      {/* 한지 텍스처 효과 */}
      <div className="absolute inset-0 opacity-30"
           style={{
             backgroundImage: `
               radial-gradient(circle at 20% 50%, rgba(183, 28, 28, 0.08) 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, rgba(141, 110, 99, 0.06) 0%, transparent 50%),
               radial-gradient(circle at 40% 80%, rgba(239, 108, 0, 0.05) 0%, transparent 50%),
               radial-gradient(circle at 0% 100%, rgba(92, 127, 154, 0.04) 0%, transparent 50%),
               radial-gradient(circle at 80% 100%, rgba(255, 203, 5, 0.03) 0%, transparent 50%)
             `,
             backgroundSize: '400px 400px, 600px 600px, 300px 300px, 500px 500px, 350px 350px'
           }}>
      </div>

      {/* 한지 섬유 질감 */}
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: `
               linear-gradient(90deg, rgba(183, 28, 28, 0.02) 50%, transparent 50%),
               linear-gradient(0deg, rgba(141, 110, 99, 0.015) 50%, transparent 50%)
             `,
             backgroundSize: '2px 2px, 3px 3px'
           }}>
      </div>

      {/* 미묘한 그라디언트 오버레이 */}
      <div className="absolute inset-0 opacity-10"
           style={{
             background: `linear-gradient(135deg, 
               rgba(183, 28, 28, 0.1) 0%, 
               rgba(239, 108, 0, 0.08) 35%, 
               rgba(141, 110, 99, 0.06) 70%, 
               rgba(92, 127, 154, 0.04) 100%)`
           }}>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        
        {/* Title with stagger animation */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight animate-fade-in-up"
            style={{color: '#B71C1C'}}>
          {title}
        </h1>
        
        {/* Subtitle with delayed animation */}
        <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up delay-300"
           style={{color: '#8D6E63'}}>
          {subtitle}
        </p>
        
        {/* Animated Line */}
        <div className="w-0 h-1 mx-auto mt-8 rounded-full animate-expand-line"
             style={{background: 'linear-gradient(to right, #B71C1C, #EF6C00)'}}></div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes expand-line {
          0% { width: 0; }
          100% { width: 6rem; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-expand-line { animation: expand-line 1.2s ease-out 0.5s forwards; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </section>
  );
}