import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postsAPI } from "../services/api";
const imgURL = "https://pbp-backend-sgys.onrender.com/public/";

export default function PostList({ posts = [], onEdit, onDelete }) {
  const [publicPosts, setPublicPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublicPosts = async () => {
    try {
      const { data } = await postsAPI.getAll();
      setPublicPosts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching public posts:", error);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchPublicPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (error) {
    return (
      <>
        {error.message === "Network Error" ? (
          <div className="flex flex-col justify-center items-center py-12">
            <h1 className="text-3xl text-orange-600">
              {error.message} <span>&#128531;</span>
            </h1>
            <p className="text-2xl text-orange-600">
              Check Your Network Connection !
            </p>
            <button
              className="w-30 bg-linear-to-r from-blue-600 to-pink-600 text-white p-3 rounded-xl cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold active:scale-95"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center py-12">
            {" "}
            <h1 className="text-2xl text-orange-500">
              Something Went Wrong,Try Again later <span>&#128531;</span>
            </h1>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="mx-2 space-y-6">
      {/* Public Posts Section (for main PostList page) */}
      {posts.length === 0 && (
        <div className="bg-linear-to-r from-emerald-300 to-indigo-300 rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-gray-600 mb-8">
            Explore published posts from all users or{" "}
            <Link
              to="/dashboard"
              className="text-blue-600 hover:underline font-semibold"
            >
              create your own
            </Link>
          </p>
        </div>
      )}

      {/* Posts Display */}
      <div className="grid gap-6">
        {(!posts.length ? publicPosts : posts).map((post) => (
          <div
            key={post._id}
            className="flex flex-col gap-2 bg-purple-300 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-3 border-white/50 hover:border-blue-200/50 "
          >
            <div className="max-h-50 flex justify-center md:justify-normal">
              <img
                className="max-w-70 float-left object-fill rounded-md mr-2 mb-2 outline-2 outline-white/50 "
                src={imgURL + `${post.newsPic}`}
                alt="Image not found...?"
              ></img>
            </div>
            {/* content div */}
            <div>
              <div className="flex justify-between items-start mb-4 ">
                <h3 className="text-xl font-bold text-gray-800 line-clamp-1 pr-4">
                  {post.title}
                </h3>
                {posts.length > 0 && (
                  <div className="flex space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-6  leading-relaxed">
                {post.content}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {post.author?.email || "Anonymous"} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>

                {posts.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(post)}
                      className="text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(post._id)}
                      className="text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No posts message */}
      {!posts.length && publicPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500 mb-6">
            Be the first to create a blog post!
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Create Your First Post
          </Link>
        </div>
      )}
    </div>
  );
}
