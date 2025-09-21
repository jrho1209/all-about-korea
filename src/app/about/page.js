export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-100 flex flex-col items-center justify-center px-4">
      <section className="max-w-3xl w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-10 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">About K-Everything</h1>
        
        {/* Mission & Purpose */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Mission & Purpose</h2>
          <p className="text-base text-gray-700">
            Our mission is to connect the world to the heart of South Korea’s culture.  
            We aim to inspire curiosity and appreciation for Korean food, travel, drama, movies, and music.
          </p>
        </div>
        
        {/* Our Story */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-pink-600 mb-2">Our Story</h2>
          <p className="text-base text-gray-700">
            K-Everything started as a passion project by fans of Korean culture.  
            Today, we’re a vibrant community sharing the latest trends and stories from Korea.
          </p>
        </div>
        
        {/* Meet the Team */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-2">Meet the Team</h2>
          <div className="flex flex-wrap gap-6 justify-center mt-4">
            <div className="flex flex-col items-center">
              <img src="" alt="Team Member 1" className="w-16 h-16 rounded-full mb-2 border-2 border-blue-200" />
              <span className="font-semibold text-gray-800">James Rho</span>
              <span className="text-sm text-gray-500">CEO</span>
            </div>
          </div>
        </div>
        
        {/* Impact */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Impact</h2>
          <p className="text-base text-gray-700">
            We’ve reached thousands of readers worldwide, helping them discover and enjoy the best of Korean culture.  
            Join us and be part of the K-Everything journey!
          </p>
        </div>
      </section>
      <footer className="mt-10 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} K-Everything. All rights reserved.
      </footer>
    </main>
  );
}