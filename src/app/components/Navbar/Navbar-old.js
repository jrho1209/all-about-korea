"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSessi                {session.user?.role === 'agency' && (
                  <Link 
                    href="/agency-dashboard"
                    onClick={closeMenu}
                    className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
                  >
                    <span className="flex items-center">
                      <span className="mr-3">📈</span>
                      Dashboard
                    </span>
                  </Link>
                )}st [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" onClick={closeMenu}>
              <img
                src="/logo/logo.png"
                alt="All About Korea Logo"
                className="h-12 w-auto hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href={session?.user ? "/agencies" : "/login"}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              Agencies
            </Link>
            <Link 
              href={session?.user ? "/about" : "/login"}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link 
              href={session?.user ? "/food" : "/login"}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              Food
            </Link>
            <Link 
              href={session?.user ? "/drama" : "/login"}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              K-Drama
            </Link>
            <Link 
              href={session?.user ? "/movies" : "/login"}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              K-Movie
            </Link>
            <Link 
              href={session?.user ? "/music" : "/login"}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              K-Music
            </Link>
            <Link 
              href={session?.user ? "/travel" : "/login"}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              Travel
            </Link>
            
            {session?.user ? (
              <div className="flex items-center space-x-4">
                {session.user?.role === 'agency' && (
                  <Link 
                    href="/agency-dashboard"
                    className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-full">
                  👋 {session.user.name || session.user.email}
                  {session.user?.role === 'agency' && (
                    <span className="ml-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      Agency
                    </span>
                  )}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login">
                <span className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Login
                </span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <Link 
            href={session?.user ? "/agencies" : "/login"}
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            <span className="flex items-center">
              <span className="mr-3">🏢</span>
              Agencies
            </span>
          </Link>
          <Link 
            href={session?.user ? "/about" : "/login"}
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            <span className="flex items-center">
              <span className="mr-3">ℹ️</span>
              About
            </span>
          </Link>
          <Link 
            href={session?.user ? "/food" : "/login"}
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            <span className="flex items-center">
              <span className="mr-3">🍜</span>
              Food
            </span>
          </Link>
          <Link 
            href={session?.user ? "/drama" : "/login"}
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            <span className="flex items-center">
              <span className="mr-3">📺</span>
              K-Drama
            </span>
          </Link>
          <Link 
            href={session?.user ? "/movies" : "/login"}
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            <span className="flex items-center">
              <span className="mr-3">🎬</span>
              K-Movie
            </span>
          </Link>
          <Link 
            href={session?.user ? "/music" : "/login"}
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            <span className="flex items-center">
              <span className="mr-3">🎵</span>
              K-Music
            </span>
          </Link>
          <Link 
            href={session?.user ? "/travel" : "/login"}
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            <span className="flex items-center">
              <span className="mr-3">✈️</span>
              Travel
            </span>
          </Link>
          
          {/* Mobile User Section */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            {session?.user ? (
              <div className="space-y-3">
                {session.user?.role === 'agency' && (
                  <Link 
                    href="/agency-dashboard"
                    onClick={closeMenu}
                    className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
                  >
                    <span className="flex items-center">
                      <span className="mr-3">📊</span>
                      대시보드
                    </span>
                  </Link>
                )}
                <div className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg">
                  <span className="flex items-center">
                    <span className="mr-2">👋</span>
                    {session.user.name || session.user.email}
                    {session.user?.role === 'agency' && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Agency
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    closeMenu();
                  }}
                  className="w-full text-left px-3 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
                >
                  <span className="flex items-center">
                    <span className="mr-3">🚪</span>
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={closeMenu}>
                <span className="block w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white text-center rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🔐</span>
                    Login
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}