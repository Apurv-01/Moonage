import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  Compass,
  User,
  ArrowLeft,
  Camera,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useCurrentUser } from "../components/CurrentUser.jsx";

export default function Settings() {
  const navigate = useNavigate();

  //   const [loading, setLoading] = useState(true);
  const { currentUser, userLoading, refetchCurrentUser } = useCurrentUser();
  // Username
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState(""); // "", "saving", "saved", "error"
  const [usernameError, setUsernameError] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Profile picture
  const [pfpFile, setPfpFile] = useState(null);
  const [pfpPreview, setPfpPreview] = useState(null);
  const [pfpStatus, setPfpStatus] = useState("");
  const [pfpError, setPfpError] = useState("");

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  useEffect(() => {
    if (currentUser?.username) {
      setUsername(currentUser.username);
    }
  }, [currentUser]);
  const handleUsernameSave = async () => {
    if (!username.trim() || username === currentUser?.username) return;
    setUsernameStatus("saving");
    setUsernameError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/dash/updateUsername`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update username");
      setUsernameStatus("saved");
      refetchCurrentUser();
      setTimeout(() => setUsernameStatus(""), 2000);
    } catch (err) {
      setUsernameStatus("error");
      setUsernameError(err.message);
    }
  };

  const handlePasswordSave = async () => {
    setPasswordError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }
    setPasswordStatus("saving");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/dash/updatePassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ currentPassword, newPassword }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update password");
      setPasswordStatus("saved");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordStatus(""), 2000);
    } catch (err) {
      setPasswordStatus("error");
      setPasswordError(err.message);
    }
  };

  const handlePfpSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPfpFile(file);
      setPfpPreview(URL.createObjectURL(file));
      setPfpError("");
    }
  };

  const handlePfpSave = async () => {
    if (!pfpFile) return;
    setPfpStatus("saving");
    setPfpError("");
    try {
      const data = new FormData();
      data.append("image", pfpFile);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/dash/updateProfilePicture`,
        {
          method: "POST",
          credentials: "include",
          body: data,
        },
      );
      const resData = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(resData.message || "Failed to update profile picture");
      setPfpStatus("saved");
      refetchCurrentUser();
      setPfpFile(null);
      setTimeout(() => setPfpStatus(""), 2000);
    } catch (err) {
      setPfpStatus("error");
      setPfpError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== currentUser?.username) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/dash/deleteAccount`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete account");
      }
      navigate("/");
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar myUserId={currentUser} loading={userLoading} />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-gray-700"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-900">Settings</span>
        </header>

        <main className="flex-1 flex justify-center px-4 py-6 pb-20 md:pb-6">
          <div className="w-full max-w-lg space-y-6">
            {userLoading ? (
              <p className="text-sm text-gray-400 text-center mt-10">
                Loading settings...
              </p>
            ) : (
              <>
                {/* Profile picture */}
                <section className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Profile Picture
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar
                        src={pfpPreview || currentUser?.pp}
                        username={currentUser?.username}
                        size={72}
                      />
                      <label className="absolute -bottom-1 -right-1 bg-gray-900 text-white rounded-full p-1.5 cursor-pointer hover:bg-gray-800 transition-colors">
                        <Camera size={14} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePfpSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex-1">
                      {pfpFile && (
                        <button
                          onClick={handlePfpSave}
                          disabled={pfpStatus === "saving"}
                          className="text-sm font-medium bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                          {pfpStatus === "saving"
                            ? "Uploading..."
                            : "Save picture"}
                        </button>
                      )}
                      {pfpStatus === "saved" && (
                        <p className="text-xs text-green-600 mt-1">
                          Profile picture updated.
                        </p>
                      )}
                      {pfpError && (
                        <p className="text-xs text-red-500 mt-1">{pfpError}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Username */}
                <section className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Username
                  </h2>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
                  />
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={handleUsernameSave}
                      disabled={
                        usernameStatus === "saving" ||
                        !username.trim() ||
                        username === currentUser?.username
                      }
                      className="text-sm font-medium bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {usernameStatus === "saving" ? "Saving..." : "Save"}
                    </button>
                    {usernameStatus === "saved" && (
                      <p className="text-xs text-green-600">Updated.</p>
                    )}
                  </div>
                  {usernameError && (
                    <p className="text-xs text-red-500 mt-2">{usernameError}</p>
                  )}
                </section>

                {/* Password */}
                <section className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Change Password
                  </h2>
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={handlePasswordSave}
                      disabled={passwordStatus === "saving"}
                      className="text-sm font-medium bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {passwordStatus === "saving"
                        ? "Saving..."
                        : "Update password"}
                    </button>
                    {passwordStatus === "saved" && (
                      <p className="text-xs text-green-600">Updated.</p>
                    )}
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-500 mt-2">{passwordError}</p>
                  )}
                </section>

                {/* Danger zone */}
                <section className="bg-white border border-red-200 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-red-600 mb-1 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Danger Zone
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    Deleting your account is permanent and cannot be undone.
                  </p>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-sm font-medium text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete account
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-600">
                        Type{" "}
                        <span className="font-semibold">
                          {currentUser?.username}
                        </span>{" "}
                        to confirm.
                      </p>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-red-400"
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={
                            deleting ||
                            deleteConfirmText !== currentUser?.username
                          }
                          className="text-sm font-medium bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {deleting ? "Deleting..." : "Permanently delete"}
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmText("");
                            setDeleteError("");
                          }}
                          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                      {deleteError && (
                        <p className="text-xs text-red-500">{deleteError}</p>
                      )}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>
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
