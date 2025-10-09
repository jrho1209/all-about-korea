'use client';

import { sanityClient } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import PageHero from "../components/PageHero/PageHero";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import LoginRequired from "../components/LoginRequired/LoginRequired";

export default function Food() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await sanityClient.fetch(
          `*[_type == "post"]{
            _id,
            title,
            "author": author->name,
            "slug": slug.current,
            body,
            "imageUrl": mainImage.asset->url,
            "imageAlt": mainImage.alt
          }`,
          {},
          { cache: "no-store" }
        );
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchPosts();
    }
  }, [session]);

  const postsPerPage = 6; // 가로 2개 x 세로 3개
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(0, postsPerPage); // 첫 페이지만 표시 (나중에 pagination 기능 추가 가능)

  // 로그인이 필요한 경우
  if (!session) {
    return (
      <LoginRequired 
        description="Please log in to explore James Food Posts and discover authentic Korean cuisine and local restaurant recommendations."
        backLink="/"
        backText="← Back to Home"
        benefits={[
          "Access exclusive food posts and recipes",
          "Discover local restaurant recommendations",
          "Save your favorite food articles",
          "Comment and share your experiences"
        ]}
      />
    );
  }

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{borderColor: '#B71C1C'}}></div>
          <p className="text-gray-600">Loading delicious content...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <PageHero />
    <main className="max-w-6xl mx-auto py-8 px-4">
        
      {/* 페이지 소개 섹션 */}
      <div className="text-center mb-16">
        <div className="relative mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            James Food{" "}
            <span className="text-red-600">Posts</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-6"></div>
        </div>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Discover the rich flavors and authentic recipes of Korean cuisine. From
          traditional dishes passed down through generations to modern Korean
          fusion, explore the culinary journey that makes Korean food so special
          and beloved worldwide.
        </p>

        {/* 특징 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
            <div className="text-3xl mb-3">🍚</div>
            <h3 className="font-bold text-gray-800 mb-2">Local Restaurants</h3>
            <p className="text-gray-600 text-sm">
              Hidden gems and popular local eateries recommended by locals
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
            <div className="text-3xl mb-3">🌶️</div>
            <h3 className="font-bold text-gray-800 mb-2">Spicy & Flavorful</h3>
            <p className="text-gray-600 text-sm">
              Bold flavors that define Korean culinary culture
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-xl border border-pink-100">
            <div className="text-3xl mb-3">🥢</div>
            <h3 className="font-bold text-gray-800 mb-2">Cultural Stories</h3>
            <p className="text-gray-600 text-sm">
              Learn the history and culture behind each dish
            </p>
          </div>
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {currentPosts.map((post) => (
          <Link
            key={post._id}
            href={`/food/${post.slug || post._id}`}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
              {/* 이미지 섹션 */}
              {post.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt || post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* 이미지 위 그라데이션 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              )}

              {/* 콘텐츠 섹션 */}
              <div className="p-8 relative">
                {/* 호버 시 나타나는 한국적 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"></div>

                <div className="relative z-10">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm font-medium group-hover:text-gray-600 transition-colors">
                      By {post.author || "Unknown"}
                    </p>
                  </div>

                  <div className="text-gray-700 leading-relaxed line-clamp-3 group-hover:text-gray-800 transition-colors duration-300">
                    <PortableText value={post.body} />
                  </div>

                  {/* 호버 시 나타나는 화살표 */}
                  <div className="mt-6 pt-4 border-t border-gray-100 group-hover:border-red-200 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-semibold group-hover:text-red-700 transition-colors duration-300">
                        Read Full Story
                      </span>
                      <div className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                        <svg
                          className="w-5 h-5 text-red-600 group-hover:text-red-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
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
    </>
  );
}