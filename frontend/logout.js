import { toast } from "react-toastify";

const logoutUser = async (navigate) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/dash/logout`, {
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
