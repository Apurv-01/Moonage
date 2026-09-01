const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(400).json({
      isAuth: false,
      error: "User Not Authenticated",
    });
  }
  next();
};
export default isAuthenticated;
