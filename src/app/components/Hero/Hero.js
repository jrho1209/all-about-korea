import styles from './Hero.module.css';

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
        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">K-Everything</h1>
        <p className="text-xl text-white drop-shadow">
          Discover the best of South Korea: Food, Travel, Drama, Movie, and Music!
        </p>
      </div>
    </section>
  );
}