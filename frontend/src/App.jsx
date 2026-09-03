import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Login/Login.jsx";
import Home from "./pages/Home/Home.jsx";
import ProtectRoute from "../protectRoute.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import { ToastContainer } from "react-toastify";
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
          path="/profile/:userId"
          element={
            <ProtectRoute>
              <Profile />
            </ProtectRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
