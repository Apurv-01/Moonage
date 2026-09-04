import commentModel from "../models/commentModel.js";
const fetchComments = async (req, res) => {
  try {
    const postId = req.query.post;
    const commentId = req.query.comment;
    const comments = await commentModel
      .find({
        postId: postId,
        commentId: commentId,
      })
      .populate("authorId", "username profile_picture_url")
      .sort({ createdAt: -1 });
    res.status(200).json({ comments });
  } catch (error) {
    next(err);
  }
};
export default fetchComments;
