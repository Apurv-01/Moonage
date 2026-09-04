import commentModel from "../models/commentModel.js";

const createComment = async (req, res) => {
  try {
    const userId = req.session.userId;
    const commentText = req.body.commentText;
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const comment = commentModel.create({
      commentText: commentText,
      postId: postId,
      commentId: commentId,
      authorId: userId,
    });
    res.status(200).json({ message: "comment created" });
  } catch (err) {
    res.status(500).json({
      error: "Cannot create Comment",
      message: error.message,
    });
  }
};
export default createComment;
