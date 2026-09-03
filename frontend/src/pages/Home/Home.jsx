import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "../../components/SearchBar.jsx";
import Avatar from "../../components/Avatar.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import CreatePost from "../../components/CreatePost.jsx";
import CommentSidebar from "../../components/CommentSidebar.jsx";
import PostCard from "../../components/PostCard.jsx";
export default function Home() {
  const [activePost, setActivePost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [myUserId, setMyUserId] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

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
      } finally {
        setUserLoading(false);
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
        toast.error(data.message || "Cannot fetch posts");
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
      <Sidebar myUserId={myUserId} loading={userLoading} />

      {/* Main column */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Top navbar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <span className="font-semibold text-gray-900 md:hidden">Circle</span>
          <SearchBar />
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
            <CreatePost myUserId={myUserId} />

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

      {activePost && (
        <CommentSidebar post={activePost} onClose={() => setActivePost(null)} />
      )}
    </div>
  );
}

<CommentSidebar />;
