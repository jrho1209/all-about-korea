import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center h-[44rem] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-blue-100">
      {/* 캐러셀 카드 컨테이너 */}
      <div className="absolute inset-0 flex items-center h-full px-16 space-x-8">
        {[1, 2, 3, 4].map((num, idx) => (
          <div
            key={num}
            className={`w-1/4 h-[40rem] rounded-3xl border border-gray-200 flex items-center justify-center
              transition-all duration-300
              ${idx === 0 ? 'scale-105' : ''}
              hover:scale-105 hover:-translate-y-2`}
            style={{
              perspective: '1000px'
            }}
          >
            <img
              src={`/hero/hero${num}.jpg`}
              alt={`Hero ${num}`}
              className="w-full h-full object-cover rounded-3xl"
              style={{
                transform: idx === 0
                  ? 'rotateY(12deg)'
                  : idx === 1
                  ? 'rotateY(-8deg)'
                  : idx === 2
                  ? 'rotateY(8deg)'
                  : 'rotateY(12deg)'
              }}
            />
          </div>
        ))}
      </div>
      {/* 텍스트 */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Daejeon Travel Platform</h1>
        <p className="text-xl text-white drop-shadow mb-8">
          Connecting International Travelers with Local Agencies
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/agencies"
            className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors transform hover:scale-105 shadow-lg"
          >
            Find Agencies
          </Link>
          <Link 
            href="/about"
            className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors transform hover:scale-105 shadow-lg"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}