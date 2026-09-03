import { toast } from "react-toastify";

const logoutUser = async (navigate) => {
  try {
    const res = await fetch("http://localhost:5000/api/dash/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) toast.error("You still here?");
    toast.success("Logged Out");
    navigate("/");
  } catch (err) {
    console.log(err);
  }
};
export default logoutUser;
