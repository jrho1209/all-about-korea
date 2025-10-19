"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" onClick={closeMenu}>
              <Image
                src="/logo/dol-e-logo.png"
                alt="Dol-E Travel Platform Logo"
                width={80}
                height={32}
                className="h-8 w-auto hover:scale-105 transition-transform duration-200"
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/about"
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link 
              href="/agencies"
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              Agencies
            </Link>
            <Link 
              href="/ai-planner"
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              AI Planner
            </Link>
            <Link 
              href="/food"
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              Food
            </Link>
            <Link 
              href="/pricing"
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
            >
              Pricing
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
                {session.user?.role !== 'agency' && session.user?.email !== 'admin@allaboutkorea.com' && (
                  <Link 
                    href="/user-dashboard"
                    className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
                  >
                    My Travel
                  </Link>
                )}
                {session.user?.email === 'admin@allaboutkorea.com' && (
                  <Link 
                    href="/admin-dashboard"
                    className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
                  >
                    Admin
                  </Link>
                )}
                
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full border border-gray-300"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs font-medium">
                          {(session.user.name || session.user.email)?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span>
                      {session.user.name || session.user.email}
                      {session.user?.role === 'agency' && (
                        <span className="ml-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          Agency
                        </span>
                      )}
                      {session.user?.email === 'admin@allaboutkorea.com' && (
                        <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                      {session.user?.subscription?.plan && session.user.subscription.status === 'active' && (
                        <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                          session.user.subscription.plan === 'BASIC' 
                            ? 'bg-green-100 text-green-600' 
                            : session.user.subscription.plan === 'PREMIUM'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {session.user.subscription.plan === 'BASIC' ? 'Basic' : 
                           session.user.subscription.plan === 'PREMIUM' ? 'Premium' : 'Free'}
                        </span>
                      )}
                    </span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={closeUserDropdown}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          Profile & Settings
                        </Link>
                        <Link
                          href="/pricing"
                          onClick={closeUserDropdown}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          Subscription
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: "/" });
                            closeUserDropdown();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
            href="/about"
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            About
          </Link>
          <Link 
            href="/agencies"
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            Agencies
          </Link>
          <Link 
            href="/ai-planner"
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            AI Planner
          </Link>
          <Link 
            href="/food"
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            Food
          </Link>
          <Link 
            href="/pricing"
            onClick={closeMenu}
            className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
          >
            Pricing
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
                    Dashboard
                  </Link>
                )}
                {session.user?.role !== 'agency' && session.user?.email !== 'admin@allaboutkorea.com' && (
                  <Link 
                    href="/user-dashboard"
                    onClick={closeMenu}
                    className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
                  >
                    My Travel
                  </Link>
                )}
                {session.user?.email === 'admin@allaboutkorea.com' && (
                  <Link 
                    href="/admin-dashboard"
                    onClick={closeMenu}
                    className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/profile"
                  onClick={closeMenu}
                  className="block px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium rounded-lg"
                >
                  Profile & Settings
                </Link>
                <div className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg">
                  <span className="flex items-center">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                        <span className="text-gray-600 text-xs font-medium">
                          {(session.user.name || session.user.email)?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {session.user.name || session.user.email}
                    {session.user?.role === 'agency' && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Agency
                      </span>
                    )}
                    {session.user?.email === 'admin@allaboutkorea.com' && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                    {session.user?.subscription?.plan && session.user.subscription.status === 'active' && (
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        session.user.subscription.plan === 'BASIC' 
                          ? 'bg-green-100 text-green-600' 
                          : session.user.subscription.plan === 'PREMIUM'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {session.user.subscription.plan === 'BASIC' ? 'Basic' : 
                         session.user.subscription.plan === 'PREMIUM' ? 'Premium' : 'Free'}
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
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={closeMenu}>
                <span className="block w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white text-center rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}