import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></span>
        <span className="text-gray-500 text-lg">Đang tải...</span>
      </div>
    );
  if (!post)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="text-red-500 text-lg">Không tìm thấy bài viết.</span>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
        <h2 className="text-4xl font-extrabold mb-6 text-blue-700 leading-tight break-words drop-shadow">
          {post.title}
        </h2>
        <p className="text-gray-800 text-xl mb-10 leading-relaxed">
          {post.body}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow hover:from-yellow-400 hover:to-yellow-500 hover:text-gray-900 font-bold text-lg transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;
