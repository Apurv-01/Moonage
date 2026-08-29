const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
      });
    }
    res.clearCookie("connect.sid");
    res.json({
      message: "Logged out successfully",
    });
  });
};
export default logoutUser;
