import React from "react";
import { Home as HomeIcon, User, LogOut, Settings, Flame } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logoutUser from "../../logout.js";

function Sidebar({ myUserId, loading }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname == path;
  function SidebarLink({ icon, label, active, onClick, disabled }) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${
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

  return (
    <>
      <aside className="hidden md:flex w-56 flex-col border-r border-gray-200 bg-white px-4 py-6 sticky top-0 h-screen">
        <h2 className="text-lg font-semibold text-gray-900 mb-8 px-2">
          🌕 Moonage
        </h2>
        <nav className="flex flex-col gap-1 h-full">
          <SidebarLink
            icon={<HomeIcon size={18} />}
            onClick={() => navigate(`/home`)}
            label="Home"
            active={isActive("/home")}
          />
          <SidebarLink
            icon={<Flame size={18} />}
            label="Trending"
            onClick={() => navigate(`/trending`)}
            active={isActive("/trending")}
          />
          <SidebarLink
            icon={<User size={18} />}
            onClick={() => {
              if (myUserId?.userId) {
                navigate(`/profile/${myUserId?.userId}`);
              }
            }}
            label="Profile"
            disabled={loading || !myUserId}
            active={location.pathname.startsWith("/profile")}
          />
          <SidebarLink
            icon={<Settings size={18} />}
            onClick={() => navigate("/settings")}
            label="Settings"
            active={isActive("/settings")}
          />
          <div className="mt-auto">
            <SidebarLink
              icon={<LogOut size={18} />}
              onClick={() => logoutUser(navigate)}
              label="Logout"
            />
          </div>
        </nav>
      </aside>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-2 z-20">
        <TabButton
          icon={<HomeIcon size={20} />}
          onClick={() => navigate(`/home`)}
          label="Home"
          active={isActive("/home")}
        />
        <TabButton
          icon={<Flame size={20} />}
          label="Trending"
          onClick={() => navigate(`/trending`)}
          active={isActive("/trending")}
        />
        <TabButton
          icon={<User size={18} />}
          onClick={() => {
            if (myUserId?.userId) {
              navigate(`/profile/${myUserId?.userId}`);
            }
          }}
          label="Profile"
          disabled={loading || !myUserId}
          active={location.pathname.startsWith("/profile")}
        />
        <TabButton
          icon={<Settings size={18} />}
          onClick={() => navigate("/settings")}
          label="Settings"
          active={isActive("/settings")}
        />
        <TabButton
          icon={<LogOut size={18} />}
          onClick={() => logoutUser(navigate)}
          label="Logout"
        />
      </nav>
    </>
  );
}

export default Sidebar;
