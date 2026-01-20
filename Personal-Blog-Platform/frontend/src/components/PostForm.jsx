import { useState, useEffect, useRef } from "react";
import { postsAPI } from "../services/api";
import { toast } from "react-toastify";

export default function PostForm({ post, onSuccess }) {
  const [input, setInput] = useState({
    title: "",
    content: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const newsPic = useRef();

  useEffect(() => {
    if (post) {
      setInput(post);
    }
  }, [post]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(e.target.files[0]);
      console.log("file Felected", file.name);
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      if (image) {
        formData.append("newsPic", image);
      }
      if (post) {
        await postsAPI.update(post._id, formData);
        toast.success("Post Edit successfully😊");
      } else {
        // Post Request
        await postsAPI.create(formData);
        toast.success("New Post created Successfully😊");
      }
      onSuccess();
      setInput({ title: "", content: "", published: false });
      newsPic.current.value = "";
      setImage(null);
    } catch (error) {
      console.error("Error saving post:", error);
      let err =
        error.message === "Network Error"
          ? error.message
          : error?.response?.data?.message;
      toast.error(`${err}😠`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" bg-fuchsia-300 backdrop-blur-md rounded-2xl p-6 shadow-xl"
    >
      <div className="mb-4">
        <input
          type="text"
          placeholder="Post Title"
          value={input.title}
          name="title"
          onChange={handleChange}
          className="input-field"
        />
      </div>
      <div className="mb-4">
        <input
          type="file"
          ref={newsPic}
          onChange={handleFileChange}
          accept="image/*"
          className="input-field"
        />
      </div>
      <div className="mb-6">
        <textarea
          placeholder="Write your blog post..."
          rows="8"
          value={input.content}
          name="content"
          onChange={handleChange}
          className="input-field"
        />
      </div>
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={input.published}
            name="published"
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">Publish</span>
        </label>
        <button type="submit" disabled={loading} className="submit_btn ">
          {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
