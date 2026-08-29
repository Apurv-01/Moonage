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
      .sort({ createdAt: -1 });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: "Cannot fetch Comments Server Error",
    });
  }
};
export default fetchComments;
