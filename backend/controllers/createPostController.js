import postModel from "../models/postModel.js";
const createPostController = async (req, res) => {
  try {
    const imgURL = req.file ? req.file.path : null;
    const { postTitle, postContent } = req.body;
    const post = new postModel({
      author: req.session.userId,
      postTitle: postTitle,
      postContent: postContent,
      postMedia: imgURL,
    });
    await post.save();
    res.status(200).json({ Message: "Post Saved" });
  } catch (error) {
    res.status(500).json({
      error: "internal Server Error",
      message: error.message,
    });
  }
};
export default createPostController;
