import mongoose from "mongoose";
const getLoggedInUserDetails = async (req, res) => {
  try {
    res.status(200).json({
      userId: req.session.userId,
      username: req.session.username,
      pp: req.session.pp,
    });
  } catch (error) {
    res.status(500).json({
      error: "ISE",
      message: error.message,
    });
  }
};

export { getLoggedInUserDetails };
