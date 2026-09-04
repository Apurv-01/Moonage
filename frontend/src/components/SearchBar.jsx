import React from "react";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar.jsx";
function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/dash/searchUsers?q=${encodeURIComponent(searchQuery)}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (!res.ok) toast.error("Search Failed");
        const data = await res.json();
        setSearchResults(data.users);
      } catch (err) {
        console.log(err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="relative flex-1 max-w-md">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 150)}
        placeholder="Search"
        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors bg-gray-50"
      />

      {showResults && searchQuery.trim() && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-20">
          {searchResults.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No users found.
            </p>
          ) : (
            searchResults.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  setShowResults(false);
                  setSearchQuery("");
                  navigate(`/profile/${user._id}`);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <Avatar
                  src={user.profile_picture_url}
                  username={user.username}
                  size={32}
                  className="w-8 h-8"
                />
                <span className="text-sm font-medium text-gray-900">
                  {user.username}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
