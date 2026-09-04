import { useState, useEffect, useRef } from "react";
import CommentItem from "./CommentItem";
import { X } from "lucide-react";
import Avatar from "./Avatar";
import { toast } from "react-toastify";
function CommentSidebar({ post, onClose }) {
  const inputRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    fetchComments();
  }, [post._id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/dash/fetchComments?post=${post._id}`,
        { method: "GET", credentials: "include" },
      );
      if (!res.ok) toast.error("Failed to fetch comments");
      const data = await res.json();
      setComments(data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/dash/createComment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            commentText: newComment,
            postId: post._id,
          }),
        },
      );
      if (!res.ok) toast.error("Failed to post comment");
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.log(err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 md:left-56 z-30 bg-white flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 shrink-0">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
          <X size={18} />
        </button>
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

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="flex-1 flex items-center justify-center min-h-0 bg-black">
          {post.postMedia ? (
            <img
              src={post.postMedia}
              alt="Post content"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <p className="text-white text-xl text-center leading-relaxed px-10">
              {post.postContent}
            </p>
          )}
        </div>

        <div className="w-full md:w-96 flex flex-col border-t md:border-t-0 md:border-l border-gray-200 h-64 md:h-full shrink-0">
          <div className="px-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-900">
            Comments
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 text-sm space-y-4">
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">
                {post.author.username}
              </span>{" "}
              {post.postContent}
            </p>

            {comments.length === 0 ? (
              <p className="text-gray-400">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  onReplyPosted={fetchComments}
                />
              ))
            )}
          </div>

          <div className="border-t border-gray-200 p-3 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
            />
            <button
              onClick={handlePostComment}
              disabled={posting || !newComment.trim()}
              className="text-sm font-medium text-gray-900 disabled:opacity-40 px-2"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CommentSidebar;
