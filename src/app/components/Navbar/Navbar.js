"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white border-b">
      <div className="flex items-center">
        <Link href="/">
          <img
            src="logo/logo.png"
            alt="K-Everything Logo"
            className="h-20 w-auto"
          />
        </Link>
      </div>
      <div className="flex space-x-8 items-center">
        <Link href="/about"><span>About</span></Link>
        <Link href="/food"><span>Food</span></Link>
        <Link href="/drama"><span>K-Drama</span></Link>
        <Link href="/movies"><span>K-Movie</span></Link>
        <Link href="/music"><span>K-Music</span></Link>
        <Link href="/travel"><span>Travel</span></Link>
        {session?.user ? (
          <>
            <span className="font-bold text-gray-700">
              {session.user.name || session.user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="ml-4 px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            <span className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-700 transition">
              Login
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}