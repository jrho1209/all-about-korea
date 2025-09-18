import Link from 'next/link';

export default function Navbar() {
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
      <div className="flex space-x-8">
        <Link href="/about"><span>About</span></Link>
        <Link href="/food"><span>Food</span></Link>
        <Link href="/drama"><span>K-Drama</span></Link>
        <Link href="/movies"><span>K-Movie</span></Link>
        <Link href="/music"><span>K-Music</span></Link>
        <Link href="/travel"><span>Travel</span></Link>
      </div>
    </nav>
  );
}