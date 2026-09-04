import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import Avatar from "./Avatar";
import { toast } from "react-toastify";
function CreatePost({ myUserId }) {
  const [postText, setPostText] = useState("");
  const [postImg, setPostImg] = useState(null);
  const [posting, setPosting] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImg(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };
  const handlePost = async () => {
    if (!postText.trim() && !postImg) return;
    setPosting(true);
    try {
      const data = new FormData();
      data.append("postContent", postText);
      if (postImg) data.append("image", postImg);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/dash/home`, {
        method: "POST",
        credentials: "include",
        body: data,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Cannot post this");
      }
      setPostText("");
      setPostImg(null);
      setImgPreview(null);
    } catch (err) {
      console.log(error);
    } finally {
      setPosting(false);
    }
  };
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex gap-3">
        <Avatar
          src={myUserId?.pp}
          username={myUserId?.username}
          size={32}
          className="w-8 h-8"
        />
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What's on your mind?"
          rows={2}
          className="flex-1 resize-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {imgPreview && (
        <img
          src={imgPreview}
          alt="Preview"
          className="w-full rounded-lg mt-2 max-h-64 object-cover"
        />
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ImageIcon size={16} />
          Photo
        </button>
        <button
          onClick={handlePost}
          disabled={posting || (!postText.trim() && !postImg)}
          className="bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {posting ? "Posting" : "Post"}
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
