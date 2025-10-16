"use client";
import styles from './Hero.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 기본 이미지들 (나중에 에이전트 사진들로 교체 가능)
  const backgroundImages = [
    '/hero/hero1.jpg',
    '/hero/hero2.jpg', 
    '/hero/hero3.jpg',
    '/hero/hero4.jpg'
  ];

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 4000); // 4초마다 변경

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative flex flex-col items-center justify-center h-[44rem] w-full overflow-hidden">
      {/* 슬라이딩 배경 이미지들 */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
        
        {/* 오버레이 */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(248, 244, 236, 0.7) 0%, rgba(141, 110, 99, 0.7) 100%)`
          }}
        />
      </div>

      {/* 슬라이드 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'scale-125 opacity-100' 
                : 'scale-100 opacity-50'
            }`}
            style={{ backgroundColor: '#B71C1C' }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* 텍스트 콘텐츠 */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-2xl md:text-5xl font-extrabold mb-3 md:mb-4 drop-shadow-lg" style={{color: '#2E2E2E'}}>
          Perfect Korea Travel with Local Friends
        </h1>
        <p className="text-sm md:text-xl drop-shadow mb-2" style={{color: '#2E2E2E'}}>
          Special Travel Experiences with Authentic Korean Locals
        </p>
        <p className="text-xs md:text-lg drop-shadow mb-6 md:mb-8 opacity-80" style={{color: '#2E2E2E'}}>
          Connect with verified local friends for unforgettable memories
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Link 
            href="/agencies"
            className="text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90 text-center"
            style={{backgroundColor: '#B71C1C'}}
          >
            Find Your Local Friend
          </Link>
          <Link 
            href="/ai-planner"
            className="text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90 text-center"
            style={{backgroundColor: '#5C7F9A'}}
          >
            Plan with AI
          </Link>
        </div>
      </div>

      {/* 슬라이드 네비게이션 화살표 */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200 z-20 hidden md:block"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length)}
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#2E2E2E" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200 z-20 hidden md:block"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)}
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#2E2E2E" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}