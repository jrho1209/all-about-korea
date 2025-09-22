import { sanityClient } from "@/sanity/client";
import { PortableText } from "@portabletext/react";

export default async function Food() {
  const posts = await sanityClient.fetch(
    `*[_type == "post"]{
      _id,
      title,
      "author": author->name,
      body
    }`
  );

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Food Posts</h1>
      <ul className="space-y-8">
        {posts.map(post => (
          <li key={post._id} className="bg-gray-100 rounded-xl p-6 shadow">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-2">By {post.author || "Unknown"}</p>
            <div className="text-gray-800 whitespace-pre-line">
              <PortableText value={post.body} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}