export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-100 flex flex-col items-center justify-center px-4">
      <section className="max-w-2xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-10 flex flex-col items-center text-center">
        <img
          src="/logo-primary.png"
          alt="K-Everything Logo"
          className="w-24 h-24 mb-6 rounded-full shadow-lg"
        />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">About K-Everything</h1>
        <p className="text-lg text-gray-600 mb-6">
          Welcome to <span className="font-semibold text-blue-500">K-Everything</span>!  
          Your gateway to the vibrant culture of South Korea.  
          Explore the latest in food, travel, drama, movies, and music—all in one place.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium shadow">Food</span>
          <span className="px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-medium shadow">Travel</span>
          <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium shadow">K-Drama</span>
          <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-medium shadow">K-Movie</span>
          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium shadow">K-Music</span>
        </div>
      </section>
      <footer className="mt-10 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} K-Everything. All rights reserved.
      </footer>
    </main>
  );
}