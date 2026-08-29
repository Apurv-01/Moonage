import likeModel from "../models/likeModel.js";
const fetchLikes = async (req, res) => {
  try {
    const userId = req.session.userId;
    const postId = req.query.post;
    const commentId = req.query.comment;
    let likes = [];
    if (commentId) {
      likes = await likeModel.find({ commentId: commentId });
    } else if (postId) {
      likes = await likeModel.find({ postId: postId });
    }
    const isLikedByMe = likes.some(
      (like) => like.likedBy.toString() === userId,
    );
    res.status(200).json({ likes, isLikedByMe });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

export default fetchLikes;
