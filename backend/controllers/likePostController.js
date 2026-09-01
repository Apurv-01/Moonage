import likeModel from "../models/likeModel.js";
const likePost = async (req, res) => {
  try {
    const userId = req.session.userId;
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const existingLike = await likeModel.findOne({
      postId,
      likedBy: userId,
    });

    if (existingLike) {
      return res.status(200).json({ message: "Already liked" });
    }
    await likeModel.create({
      postId: postId,
      commentId: commentId,
      likedBy: userId,
    });
    res.status(200).json({ message: "Liked!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Cannot Like",
      message: error.message,
    });
  }
};
const unlikePost = async (req, res) => {
  try {
    const userId = req.session.userId;
    const postId = req.body.postId;
    const like = await likeModel.deleteOne({ postId: postId, likedBy: userId });
    res.status(200).json({ message: "Unliked!" });
  } catch (error) {
    res.status(500).json({
      error: "ISE",
      message: error.message,
    });
  }
};
export { likePost, unlikePost };
