import React from "react";
import { useState } from "react";

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

export default Avatar;
