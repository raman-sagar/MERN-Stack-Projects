import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import PostList from "./PostList";
import { postsAPI } from "../services/api";
import { toast } from "react-toastify";

export default function Dashboard({ setUser }) {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [activeTab, setActiveTab] = useState("create");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const { data } = await postsAPI.getMyPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSuccess = () => {
    fetchPosts();
    setEditingPost(null);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setActiveTab("manage");
    setActiveTab("create");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsAPI.delete(id);
        fetchPosts();
        toast.success("Post deleted successfully😊");
      } catch (error) {
        console.error("Error deleting post:", error);
        let err =
          error.message === "Network Error"
            ? error.message
            : error?.response?.data?.message;
        toast.error(`${err}😠`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-8">
      <div className=" max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-pink-800 to-emerald-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <div>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === "create"
                    ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white shadow-lg cursor-pointer"
                    : "bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl cursor-pointer"
                }`}
              >
                Create Post
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  activeTab === "manage"
                    ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white shadow-lg cursor-pointer"
                    : "bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl cursor-pointer"
                }`}
              >
                Manage Posts ({posts.length})
              </button>
            </div>

            {activeTab === "create" && (
              <PostForm onSuccess={handlePostSuccess} post={editingPost} />
            )}
          </div>

          {activeTab === "manage" && (
            <PostList
              posts={posts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
