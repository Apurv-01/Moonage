import likeModel from "../models/likeModel.js";
const likePost = async (req, res) => {
  try {
    const userId = req.session.userId;
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const filter = commentId
      ? { commentId, likedBy: userId }
      : { postId, likedBy: userId };

    const existingLike = await likeModel.findOne(filter);

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
    next(err);
  }
};
const unlikePost = async (req, res) => {
  try {
    const userId = req.session.userId;
    const postId = req.body.postId;
    const commentId = req.body.commentId;

    const filter = commentId
      ? { commentId, likedBy: userId }
      : { postId, likedBy: userId };

    await likeModel.deleteOne(filter);
    res.status(200).json({ message: "Unliked!" });
  } catch (error) {
    next(err);
  }
};
export { likePost, unlikePost };
