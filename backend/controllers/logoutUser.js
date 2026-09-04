const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
      });
    }
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: process.env.NODE_ENV === "prod" ? "strict" : "lax",
    });
    res.status(200).json({
      message: "Logged out successfully",
    });
  });
};
export default logoutUser;
