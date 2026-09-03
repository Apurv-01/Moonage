import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Grid3x3, Heart, MessageCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar.jsx";
export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [listView, setListView] = useState(null); // "followers" | "following" | null
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (userId) fetchProfile(userId);
  }, [userId]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dash/me", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) toast.error("Not logged in");
      const data = await res.json();
      setCurrentUserId(data.userId);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProfile = async (id) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/dash/user?userId=${id}`,
        { method: "GET", credentials: "include" },
      );
      if (!res.ok) toast.error("Cannot load this profile");
      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    try {
      const url = profileData.isFollowing
        ? "http://localhost:5000/api/dash/unfollowUser"
        : "http://localhost:5000/api/dash/followUser";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ followingId: userId }),
      });
      if (!res.ok) toast.error("Failed to update follow status");
      fetchProfile(userId);
    } catch (err) {
      console.log(err);
    } finally {
      setFollowLoading(false);
    }
  };

  const isOwnProfile = currentUserId && currentUserId === userId;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-gray-700"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-900">
            {profileData?.user?.username || "Profile"}
          </span>
        </header>

        <main className="flex-1 flex justify-center px-4 py-6 pb-20 md:pb-6">
          <div className="w-full max-w-lg">
            {loading && (
              <p className="text-sm text-gray-400 text-center mt-10">
                Loading profile...
              </p>
            )}

            {error && (
              <p className="text-sm text-red-500 text-center mt-10">{error}</p>
            )}

            {!loading && !error && profileData && profileData.user && (
              <>
                <div className="flex items-center gap-6 mb-6">
                  <Avatar
                    src={profileData.user?.profile_picture_url}
                    username={profileData.user.username}
                    size={80}
                  />
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-semibold text-gray-900 truncate">
                      {profileData.user.username}
                    </h1>
                    {profileData.user.bio && (
                      <p className="text-sm text-gray-500 mt-1">
                        {profileData.user.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-around border-y border-gray-200 py-3 mb-4">
                  <Stat label="Posts" value={profileData.stats.posts} />
                  <Stat
                    label="Followers"
                    value={profileData.stats.followers}
                    onClick={() => setListView("followers")}
                  />
                  <Stat
                    label="Following"
                    value={profileData.stats.following}
                    onClick={() => setListView("following")}
                  />
                </div>

                {isOwnProfile ? (
                  <button className="w-full bg-gray-100 text-gray-900 text-sm font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors mb-6">
                    It's you
                  </button>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`w-full text-sm font-medium py-2 rounded-lg transition-colors mb-6 disabled:opacity-60 ${
                      profileData.isFollowing
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {profileData.isFollowing ? "Following" : "Follow"}
                  </button>
                )}

                <div className="flex items-center gap-2 text-xs font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3">
                  <Grid3x3 size={14} />
                  Posts
                </div>

                {profileData.posts.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">
                    No posts yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {profileData.posts.map((post) =>
                      post.postMedia ? (
                        <div
                          key={post._id}
                          onClick={() =>
                            setActivePost({
                              ...post,
                              author: profileData.user,
                            })
                          }
                          className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                        >
                          <img
                            src={post.postMedia}
                            alt="Post"
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                            {/* <span className="flex items-center gap-1 text-white text-sm font-medium">
                              <Heart size={16} className="fill-white" />
                              {post.likes || 0}
                            </span>
                            <span className="flex items-center gap-1 text-white text-sm font-medium">
                              <MessageCircle size={16} className="fill-white" />
                              {post.commentsCount || 0}
                            </span> */}
                          </div>
                        </div>
                      ) : (
                        <div
                          key={post._id}
                          onClick={() =>
                            setActivePost({
                              ...post,
                              author: profileData.user,
                            })
                          }
                          className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col cursor-pointer"
                        >
                          <div className="flex-1 flex items-center justify-center px-3 py-2">
                            <p className="text-white text-xs text-center leading-relaxed line-clamp-5">
                              {post.postContent}
                            </p>
                          </div>
                          <div className="flex items-center justify-center gap-3 px-2 py-1.5 bg-black/30 border-t border-white/10">
                            {/* <span className="flex items-center gap-1 text-white/80 text-xs">
                              <Heart size={12} />
                              {post.likes || 0}
                            </span>
                            <span className="flex items-center gap-1 text-white/80 text-xs">
                              <MessageCircle size={12} />
                              {post.commentsCount || 0}
                            </span> */}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {listView && profileData && (
        <UserListPanel
          title={listView === "followers" ? "Followers" : "Following"}
          users={
            listView === "followers"
              ? profileData.followers
              : profileData.following
          }
          userKey={listView === "followers" ? "followerId" : "followingId"}
          isOwnProfile={isOwnProfile}
          isFollowingList={listView === "following"}
          onClose={() => setListView(null)}
          onNavigate={(id) => {
            setListView(null);
            navigate(`/profile/${id}`);
          }}
          onListChanged={() => fetchProfile(userId)}
        />
      )}

      {activePost && (
        <CommentSidebar post={activePost} onClose={() => setActivePost(null)} />
      )}
    </div>
  );
}

function Avatar({ src, username, size = 40, className = "" }) {
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

function Stat({ label, value, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="text-center disabled:cursor-default"
    >
      <div className="text-base font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
        {label}
      </div>
    </button>
  );
}

function UserListPanel({
  title,
  users,
  userKey,
  isOwnProfile,
  isFollowingList,
  onClose,
  onNavigate,
  onListChanged,
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-20" onClick={onClose} />
      <div className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white border-l border-gray-200 z-30 flex flex-col shadow-xl">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 shrink-0">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <X size={18} />
          </button>
          <span className="text-sm font-medium text-gray-900">{title}</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              No {title.toLowerCase()} yet.
            </p>
          ) : (
            users.map((entry) => {
              const person = entry[userKey];
              if (!person) return null;
              return (
                <UserListItem
                  key={person._id}
                  person={person}
                  isOwnProfile={isOwnProfile}
                  isFollowingList={isFollowingList}
                  onNavigate={onNavigate}
                  onListChanged={onListChanged}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

function UserListItem({
  person,
  isOwnProfile,
  isFollowingList,
  onNavigate,
  onListChanged,
}) {
  const [loading, setLoading] = useState(false);

  const handleUnfollow = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/dash/unfollowUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ followingId: person._id }),
      });
      if (!res.ok) toast.error("Failed to unfollow");
      onListChanged?.();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
      <button
        onClick={() => onNavigate(person._id)}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <Avatar
          src={person.profile_picture_url}
          username={person.username}
          size={40}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {person.username}
          </p>
          {person.bio && (
            <p className="text-xs text-gray-400 truncate">{person.bio}</p>
          )}
        </div>
      </button>

      {isOwnProfile && isFollowingList && (
        <button
          onClick={handleUnfollow}
          disabled={loading}
          className="text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 disabled:opacity-50 shrink-0"
        >
          {loading ? "..." : "Unfollow"}
        </button>
      )}
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
      const res = await fetch("http://localhost:5000/api/dash/createComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          commentText: newComment,
          postId: post._id,
        }),
      });
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
        ? "http://localhost:5000/api/dash/deleteLike"
        : "http://localhost:5000/api/dash/likePost";
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
        `http://localhost:5000/api/dash/fetchComments?comment=${comment._id}`,
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
      const res = await fetch("http://localhost:5000/api/dash/createComment", {
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
