import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Flame, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import { useCurrentUser } from "../components/CurrentUser.jsx";
import PostCard from "../components/PostCard.jsx";
import CommentSidebar from "../components/CommentSidebar.jsx";
import Avatar from "../components/Avatar.jsx";
function RangeToggle({ range, setRange }) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
      <button
        onClick={() => setRange("all")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          range === "all"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        All time
      </button>
      <button
        onClick={() => setRange("24h")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          range === "24h"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        Last 24h
      </button>
    </div>
  );
}

function TrendingUserRow({
  user,
  rank,
  onFollowToggle,
  followBusy,
  currentUser,
}) {
  const navigate = useNavigate();
  const isMe = user._id.toString() === currentUser?.userId;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="w-5 text-sm font-semibold text-gray-400 shrink-0">
        {rank}
      </span>
      <button
        onClick={() => navigate(`/profile/${user._id}`)}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <Avatar
          src={user.profile_picture_url}
          username={user.username}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.username}
          </p>
          <p className="text-xs text-gray-400">
            {user.followerCount} follower{user.followerCount === 1 ? "" : "s"}
          </p>
        </div>
      </button>
      {!isMe && (
        <button
          onClick={() => onFollowToggle(user)}
          disabled={followBusy}
          className={`shrink-0 text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
            user.isFollowing
              ? "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {user.isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}

function SectionSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

function Trending() {
  const navigate = useNavigate();
  const { currentUser, userLoading } = useCurrentUser();

  const [postsRange, setPostsRange] = useState("all");
  const [usersRange, setUsersRange] = useState("all");

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [followBusyId, setFollowBusyId] = useState(null);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      setPostsLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/dash/trendingPosts?range=${postsRange}`,
          { method: "GET", credentials: "include" },
        );
        if (!res.ok) throw new Error("Cannot fetch trending posts");
        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        console.log(err);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };
    fetchTrendingPosts();
  }, [postsRange]);

  useEffect(() => {
    const fetchTrendingUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/dash/trendingUsers?range=${usersRange}`,
          { method: "GET", credentials: "include" },
        );
        if (!res.ok) throw new Error("Cannot fetch trending users");
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.log(err);
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchTrendingUsers();
  }, [usersRange]);

  const handleFollowToggle = async (user) => {
    const wasFollowing = user.isFollowing;
    setFollowBusyId(user._id);
    setUsers((prev) =>
      prev.map((u) =>
        u._id === user._id
          ? {
              ...u,
              isFollowing: !wasFollowing,
              followerCount: wasFollowing
                ? u.followerCount - 1
                : u.followerCount + 1,
            }
          : u,
      ),
    );
    try {
      const url = wasFollowing
        ? `${import.meta.env.VITE_API_URL}/dash/unfollowUser`
        : `${import.meta.env.VITE_API_URL}/dash/followUser`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ followingId: user._id }),
      });
      if (!res.ok) throw new Error("Unable to update follow state");
    } catch (err) {
      console.log(err);
      // roll back on failure
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? {
                ...u,
                isFollowing: wasFollowing,
                followerCount: wasFollowing
                  ? u.followerCount + 1
                  : u.followerCount - 1,
              }
            : u,
        ),
      );
    } finally {
      setFollowBusyId(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <Sidebar myUserId={currentUser} loading={userLoading} />

      <main className="flex-1 md:pl-0 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center gap-2 mb-8">
            <Flame size={22} className="text-gray-900" />
            <h1 className="text-xl font-semibold text-gray-900">Trending</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trending posts */}
            <section className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Top posts
                </h2>
                <RangeToggle range={postsRange} setRange={setPostsRange} />
              </div>

              {postsLoading ? (
                <SectionSkeleton rows={4} />
              ) : posts.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl py-12 text-center">
                  <p className="text-sm text-gray-400">
                    No trending posts yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post, i) => (
                    // <TrendingPostCard
                    //   key={post._id}
                    //   post={post}
                    //   rank={i + 1}
                    //   onClick={() => navigate(`/post/${post._id}`)}
                    // />
                    <PostCard
                      key={post._id}
                      post={post}
                      rank={i + 1}
                      onCommentClick={() => setActivePost(post)}
                    />
                  ))}
                </div>
              )}
            </section>
            {activePost && (
              <CommentSidebar
                post={activePost}
                onClose={() => setActivePost(null)}
              />
            )}
            {/* Trending users */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <TrendingUp size={15} />
                  Most followed
                </h2>
              </div>
              <div className="mb-4">
                <RangeToggle range={usersRange} setRange={setUsersRange} />
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {usersLoading ? (
                  <div className="p-4">
                    <SectionSkeleton rows={5} />
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-12">
                    No users to show.
                  </p>
                ) : (
                  users.map((user, i) => (
                    <TrendingUserRow
                      currentUser={currentUser}
                      key={user._id}
                      user={user}
                      rank={i + 1}
                      onFollowToggle={handleFollowToggle}
                      followBusy={followBusyId === user._id}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Trending;
