import postModel from "../models/postModel.js";
import followModel from "../models/followModel.js";
import likeModel from "../models/likeModel.js";
import commentModel from "../models/commentModel.js";
import mongoose from "mongoose";
const homeController = async (req, res) => {
  const userId = req.session.userId;
  const followingDocs = await followModel.find({ followerId: userId });
  const followingIds = followingDocs.map((doc) => doc.followingId);
  const postDocsLikedbyFollowing = await likeModel.find({
    likedBy: { $in: followingIds },
    commentId: null,
  });
  const postIdsLikedbyFollowing = postDocsLikedbyFollowing.map((d) => d.postId);
  const postDocsCommentbyFollowing = await commentModel.find({
    authorId: { $in: followingIds },
  });
  const postIdsCommentbyFollowing = postDocsCommentbyFollowing.map(
    (d) => d.postId,
  );
  const allPostIds = [...postIdsCommentbyFollowing, ...postIdsLikedbyFollowing];
  const uniquePostIdsString = [...new Set(allPostIds.map((d) => d.toString()))];
  const uniquePostIds = uniquePostIdsString.map(
    (id) => new mongoose.Types.ObjectId(id),
  );
  // console.log("userId:", userId);
  // console.log("followingIds:", followingIds);

  // console.log("postIdsLikedbyFollowing:", postIdsLikedbyFollowing);

  // console.log("postIdsCommentbyFollowing:", postIdsCommentbyFollowing);

  // console.log("uniquePostIds:", uniquePostIds);
  //Liked,commented by people you follow or they are author
  const post = await postModel
    .find({
      $or: [
        { _id: { $in: uniquePostIds } },
        { author: { $in: followingIds } },
        // { author: userId },
      ],
    })
    .populate("author", "_id username profile_picture_url")
    .sort({ createdAt: -1 });
  res.status(200).json(post);
};
export default homeController;
