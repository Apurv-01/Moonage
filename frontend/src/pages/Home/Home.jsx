import { useState, useRef, useEffect } from "react";
import {
  Home as HomeIcon,
  Compass,
  User,
  Search,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [postText, setPostText] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [myUserId, setMyUserId] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dash/me", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setMyUserId(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dash/home", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Cannot fetch posts");
      }
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-gray-200 bg-white px-4 py-6 sticky top-0 h-screen">
        <h2 className="text-lg font-semibold text-gray-900 mb-8 px-2">
          Circle
        </h2>
        <nav className="flex flex-col gap-1">
          <SidebarLink
            icon={<HomeIcon size={18} />}
            onClick={() => navigate(`/home`)}
            label="Home"
            active
          />
          <SidebarLink icon={<Compass size={18} />} label="Explore" />
          <SidebarLink
            icon={<User size={18} />}
            onClick={() => navigate(`/profile/${myUserId.userId}`)}
            label="Profile"
          />
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Top navbar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <span className="font-semibold text-gray-900 md:hidden">Circle</span>
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors bg-gray-50"
            />
          </div>
          <Avatar
            src={myUserId?.pp}
            username={myUserId?.username}
            size={32}
            className="w-8 h-8"
          />
        </header>

        {/* Feed */}
        <main className="flex-1 flex justify-center px-4 py-6 pb-20 md:pb-6">
          <div className="w-full max-w-lg space-y-5">
            {/* Create post box */}
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
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <ImageIcon size={16} />
                  Photo
                </button>
                <button className="bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                  Post
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {!error && posts.length === 0 && (
              <p className="text-sm text-gray-400 text-center">No posts yet.</p>
            )}

            {/* Posts */}
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onCommentClick={() => setActivePost(post)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-2 z-20">
        <TabButton
          icon={<HomeIcon size={20} />}
          onClick={() => navigate(`/home`)}
          label="Home"
          active
        />
        <TabButton icon={<Compass size={20} />} label="Explore" />
        <TabButton
          icon={<User size={20} />}
          onClick={() => navigate(`/profile/${myUserId.userId}`)}
          label="Profile"
        />
      </nav>

      {activePost && (
        <CommentSidebar post={activePost} onClose={() => setActivePost(null)} />
      )}
    </div>
  );
}

function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors ${
        active ? "text-gray-900" : "text-gray-400"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SidebarLink({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-gray-100 text-gray-900 font-medium"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
function Avatar({ src, username, size = 32, className = "" }) {
  const [failed, setFailed] = useState(false);
  const initial = username?.[0]?.toUpperCase() || "?";

  if (!src || failed) {
    return (
      <div
        className={`shrink-0 rounded-full bg-gray-200 text-gray-500 font-medium flex items-center justify-center ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={username}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
function PostCard({ post, onCommentClick }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  useEffect(() => {
    const fetchPostLikes = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/dash/fetchLikes/?post=${post._id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Cannot Fetch Likess");
        const data = await res.json();
        setLikeCount(data.likes.length);
        setLiked(data.isLikedByMe);
      } catch (err) {
        throw new Error(err);
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
        ? "http://localhost:5000/api/dash/deleteLike"
        : "http://localhost:5000/api/dash/likePost";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId: post._id }),
      });
      if (!res.ok) throw new Error("Unable to Like this post");
    } catch (err) {
      throw new Error(err);
      setLiked(wasLiked);
      setLikeCount((c) => {
        liked ? c + 1 : c - 1;
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
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
        `http://localhost:5000/api/dash/fetchComments?post=${post._id}`,
        { method: "GET", credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
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
      const res = await fetch("http://localhost:5000/api/dash/createComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          commentText: newComment,
          postId: post._id,
        }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
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
          `http://localhost:5000/api/dash/fetchLikes?comment=${comment._id}`,
          { method: "GET", credentials: "include" },
        );
        if (!res.ok) throw new Error("Failed to fetch likes");
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
        ? "http://localhost:5000/api/dash/deleteLike"
        : "http://localhost:5000/api/dash/likePost";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ commentId: comment._id }),
      });
      if (!res.ok) throw new Error("Failed to update like");
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
        `http://localhost:5000/api/dash/fetchComments?comment=${comment._id}`,
        { method: "GET", credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to fetch replies");
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
      const res = await fetch("http://localhost:5000/api/dash/createComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          commentText: replyText,
          commentId: comment._id,
        }),
      });
      if (!res.ok) throw new Error("Failed to post reply");
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
