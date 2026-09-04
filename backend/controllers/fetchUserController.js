import userModel from "../models/userModel.js";
const fetchUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await userModel.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    next(err);
  }
};
export default fetchUser;
