import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ProtectRoute from "../protectRoute.jsx";
import Profile from "./pages/Profile.jsx";
import { ToastContainer } from "react-toastify";
import Settings from "./pages/Setting.jsx";
import TrendingPage from "./pages/Trending.jsx";
function App() {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route path="/" element={<AuthPage />}></Route>
        <Route
          path="/home"
          element={
            <ProtectRoute>
              <Home />
            </ProtectRoute>
          }
        />
        <Route
          path="/trending"
          element={
            <ProtectRoute>
              <TrendingPage />
            </ProtectRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectRoute>
              <Profile />
            </ProtectRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectRoute>
              <Settings />
            </ProtectRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
