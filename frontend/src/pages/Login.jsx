import { useState } from "react";
import { User, AtSign, Mail, Lock, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [dpPreview, setDpPreview] = useState(null);
  const [dpURL, setDpURL] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleDpChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDpPreview(URL.createObjectURL(file));
      setDpURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode == "login") {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => {});
          // throw new Error(data.message || "Invalid Password");
          toast.error(data.message || "Invalid Username or Password");
        }
        const data = await res.json();
        toast.success("Login Successful");
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/user/register`,
          {
            method: "POST",
            credentials: "include",
            body: (() => {
              const data = new FormData();
              data.append("name", form.name);
              data.append("username", form.username);
              data.append("email", form.email);
              data.append("password", form.password);
              if (dpURL) data.append("image", dpURL);
              return data;
            })(),
          },
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data.message || "Registration failed");
        }

        const data = await res.json();
        toast.success("Registered");
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (error) {
      // toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-xl font-medium text-gray-900 text-center mb-1">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm text-gray-400 text-center mb-6">
            {mode === "login"
              ? "Sign in to continue"
              : "Sign up to get started"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div className="flex justify-center mb-2">
                  <label className="relative cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                      {dpPreview ? (
                        <img
                          src={dpPreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera size={22} className="text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDpChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={update("name")}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={update("email")}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
              </>
            )}
            <div className="relative">
              <AtSign
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={update("username")}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={update("password")}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors mt-2"
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() =>
                setMode((m) => (m === "login" ? "register" : "login"))
              }
              className="text-gray-900 font-medium hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
