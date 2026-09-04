import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Avatar from "./Avatar";
import { Heart, MessageCircle } from "lucide-react";

function PostCard({ post, rank, onCommentClick }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  useEffect(() => {
    const fetchPostLikes = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.API}/dash/fetchLikes/?post=${post._id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (!res.ok) toast.error("Cannot Fetch Likes");
        const data = await res.json();
        setLikeCount(data.likes.length);
        setLiked(data.isLikedByMe);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPostLikes();
  }, [post._id]);
  const toggleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    try {
      const url = wasLiked
        ? "${import.meta.env.API}/dash/deleteLike"
        : "${import.meta.env.API}/dash/likePost";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId: post._id }),
      });
      if (!res.ok) toast.error("Unable to Like this post");
    } catch (err) {
      console.log(err);
      setLiked(wasLiked);
      setLikeCount((c) => {
        liked ? c + 1 : c - 1;
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        {rank && (
          <span className="w-5 text-sm font-semibold text-gray-400 shrink-0">
            {rank}
          </span>
        )}
        <Avatar
          src={post.author.profile_picture_url}
          username={post.author.username}
          size={32}
          className="w-8 h-8"
        />
        <span className="text-sm font-medium text-gray-900">
          {post.author.username}
        </span>
      </div>

      {post.postMedia ? (
        <img
          src={post.postMedia}
          alt="Post content"
          className="w-full aspect-[3/2] object-cover"
        />
      ) : (
        <div className="w-full aspect-[3/2] bg-gray-900 flex items-center justify-center px-8">
          <p className="text-white text-lg text-center leading-relaxed">
            {post.postContent}
          </p>
        </div>
      )}

      <div className="px-4 py-3">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={toggleLike}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Heart
              size={18}
              className={liked ? "fill-red-500 text-red-500" : ""}
            />
            {likeCount}
          </button>
          <button
            onClick={onCommentClick}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <MessageCircle size={18} />
            Comment
          </button>
        </div>
        {post.postMedia && (
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">
              {post.author.username}
            </span>{" "}
            {post.postContent}
          </p>
        )}
      </div>
    </div>
  );
}
export default PostCard;
