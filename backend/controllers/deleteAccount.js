// controllers/deleteAccountController.js
import userModel from "../models/userModel.js";
import postModel from "../models/postModel.js";
import commentModel from "../models/commentModel.js";
import likeModel from "../models/likeModel.js";
import followModel from "../models/followModel.js";

const deleteAccount = async (req, res) => {
  try {
    const userId = req.session.userId;

    const userPosts = await postModel.find({ author: userId }).select("_id");
    const postIds = userPosts.map((p) => p._id);

    await Promise.all([
      postModel.deleteMany({ author: userId }),
      commentModel.deleteMany({ authorId: userId }),
      commentModel.deleteMany({ postId: { $in: postIds } }),
      likeModel.deleteMany({ likedBy: userId }),
      likeModel.deleteMany({ postId: { $in: postIds } }),
      followModel.deleteMany({ followerId: userId }),
      followModel.deleteMany({ followingId: userId }),
      userModel.findByIdAndDelete(userId),
    ]);

    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Deleted but failed to clear session" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Account deleted" });
    });
  } catch (error) {
    next(err);
  }
};

export default deleteAccount;
