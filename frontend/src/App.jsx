import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Login/Login.jsx";
import Home from "./pages/Home/Home.jsx";
import ProtectRoute from "../protectRoute.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthPage />}></Route>
        <Route
          path="/home"
          element={
            <ProtectRoute>
              <Home />{" "}
            </ProtectRoute>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
