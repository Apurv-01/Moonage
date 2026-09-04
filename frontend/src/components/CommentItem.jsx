import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
function CommentItem({ comment, onReplyPosted }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  useEffect(() => {
    const fetchCommentLikes = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.API}/dash/fetchLikes?comment=${comment._id}`,
          { method: "GET", credentials: "include" },
        );
        if (!res.ok) toast.error("Failed to fetch likes");
        const data = await res.json();
        setLikeCount(data.likes.length);
        setLiked(data.isLikedByMe);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCommentLikes();
  }, [comment._id]);

  const toggleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    try {
      const url = wasLiked
        ? "${import.meta.env.API}/dash/deleteLike"
        : "${import.meta.env.API}/dash/likePost";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ commentId: comment._id }),
      });
      if (!res.ok) toast.error("Failed to update like");
    } catch (err) {
      console.log(err);
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    }
  };

  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      const res = await fetch(
        `${import.meta.env.API}/dash/fetchComments?comment=${comment._id}`,
        { method: "GET", credentials: "include" },
      );
      if (!res.ok) toast.error("Failed to fetch replies");
      const data = await res.json();
      setReplies(data.comments);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingReplies(false);
    }
  };

  const toggleReplies = () => {
    if (!showReplies) fetchReplies();
    setShowReplies((s) => !s);
  };

  const handlePostReply = async () => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch("${import.meta.env.API}/dash/createComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          commentText: replyText,
          commentId: comment._id,
        }),
      });
      if (!res.ok) toast.error("Failed to post reply");
      setReplyText("");
      setShowReplyBox(false);
      if (showReplies) fetchReplies();
      onReplyPosted?.();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="text-sm">
      <p className="text-gray-700">
        <span className="font-medium text-gray-900">
          {comment.authorId?.username || "user"}
        </span>{" "}
        {comment.commentText}
      </p>
      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${
            liked ? "text-red-500" : ""
          }`}
        >
          <Heart size={13} className={liked ? "fill-red-500" : ""} />
          {likeCount > 0 && likeCount}
        </button>
        <button
          onClick={() => setShowReplyBox((s) => !s)}
          className="hover:text-gray-700 transition-colors"
        >
          Reply
        </button>
        <button
          onClick={toggleReplies}
          className="hover:text-gray-700 transition-colors"
        >
          {showReplies ? "Hide replies" : "View replies"}
        </button>
      </div>

      {showReplyBox && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePostReply()}
            placeholder="Write a reply..."
            className="flex-1 px-2 py-1 rounded-md border border-gray-200 text-xs focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={handlePostReply}
            disabled={!replyText.trim()}
            className="text-xs font-medium text-gray-900 disabled:opacity-40"
          >
            Post
          </button>
        </div>
      )}

      {showReplies && (
        <div className="mt-2 ml-4 pl-3 border-l border-gray-100 space-y-3">
          {loadingReplies && (
            <p className="text-xs text-gray-400">Loading...</p>
          )}
          {!loadingReplies && replies.length === 0 && (
            <p className="text-xs text-gray-400">No replies yet.</p>
          )}
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onReplyPosted={fetchReplies}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default CommentItem;
