import { sanityClient } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";

export default async function Food() {
  const posts = await sanityClient.fetch(
    `*[_type == "post"]{
      _id,
      title,
      "author": author->name,
      "slug": slug.current,
      body
    }`,
    {},
    { cache: "no-store" }
  );

  const postsPerPage = 6; // 가로 2개 x 세로 3개
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(0, postsPerPage); // 첫 페이지만 표시 (나중에 pagination 기능 추가 가능)

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Food Posts</h1>
      
      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {currentPosts.map(post => (
          <Link 
            key={post._id} 
            href={`/food/${post.slug || post._id}`}
            className="group"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
              {/* 호버 시 나타나는 한국적 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="relative z-10">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium group-hover:text-gray-600 transition-colors">
                    By {post.author || "Unknown"}
                  </p>
                </div>
                
                <div className="text-gray-700 leading-relaxed line-clamp-4 group-hover:text-gray-800 transition-colors duration-300">
                  <PortableText value={post.body} />
                </div>
                
                {/* 호버 시 나타나는 화살표 */}
                <div className="mt-6 pt-4 border-t border-gray-100 group-hover:border-red-200 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-semibold group-hover:text-red-700 transition-colors duration-300">
                      Read Full Story
                    </span>
                    <div className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                      <svg className="w-5 h-5 text-red-600 group-hover:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
            ← Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-full font-semibold transition-colors ${
                index === 0
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
            Next →
          </button>
        </div>
      )}
    </main>
  );
}