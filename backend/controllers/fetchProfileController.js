import followModel from "../models/followModel.js";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
const fetchProfile = async (req, res) => {
  try {
    const userId = req.query.userId;
    const loggedInUser = req.session.userId;
    const [user, posts, followers, following] = await Promise.all([
      userModel.findById(userId),
      postModel.find({ author: userId }).sort({ createdAt: -1 }),
      followModel
        .find({ followingId: userId })
        .populate("followerId", "username profile_picture_url bio"),
      followModel
        .find({ followerId: userId })
        .populate("followingId", "username profile_picture_url bio"),
    ]);
    const isFollowing = followers.some(
      (uid) => uid.followerId._id.toString() == loggedInUser,
    );
    res.status(200).json({
      user,
      posts,
      followers,
      following,
      stats: {
        posts: posts.length,
        followers: followers.length,
        following: following.length,
      },
      isFollowing,
    });
  } catch (error) {
    next(err);
  }
};
export default fetchProfile;
