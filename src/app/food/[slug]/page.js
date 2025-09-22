import { sanityClient } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";

export default async function FoodPost({ params }) {
  const { slug } = params;
  
  const post = await sanityClient.fetch(
    `*[_type == "post" && (slug.current == "${slug}" || _id == "${slug}")][0]{
      _id,
      title,
      "author": author->name,
      body,
      publishedAt,
      "slug": slug.current
    }`,
    {},
    { cache: "no-store" }
  );

  if (!post) {
    return (
      <main className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
        <Link href="/food" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
          Back to Food Posts
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      {/* 뒤로가기 버튼 */}
      <Link 
        href="/food" 
        className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors mb-8 group"
      >
        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Food Posts
      </Link>

      {/* 포스트 헤더 */}
      <article className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <header className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-600 space-x-4">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              By {post.author || "Unknown"}
            </span>
            {post.publishedAt && (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </header>

        {/* 포스트 본문 */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <PortableText 
            value={post.body}
            components={{
              block: {
                normal: ({children}) => <p className="mb-6 text-lg leading-relaxed">{children}</p>,
                h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-800">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-800">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800">{children}</h3>,
              },
            }}
          />
        </div>
      </article>

      {/* 관련 포스트나 댓글 섹션을 나중에 추가 가능 */}
    </main>
  );
}