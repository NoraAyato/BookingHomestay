import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-extrabold mb-10 text-center text-blue-700 drop-shadow">
        Danh sách bài viết
      </h2>
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></span>
          <span className="text-gray-500 text-lg">Đang tải...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:scale-[1.02] hover:shadow-2xl transition-all duration-200 border border-gray-100"
            >
              <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.body}</p>
              <Link
                to={`/post/${post.id}`}
                className="self-end px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:from-yellow-400 hover:to-yellow-500 hover:text-gray-900 font-semibold text-sm transition"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
