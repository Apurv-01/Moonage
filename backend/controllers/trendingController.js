import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import postModel from "../models/postModel.js";
import followModel from "../models/followModel.js";
import likeModel from "../models/likeModel.js";
const trendingPosts = async (req, res) => {
  try {
    const range = req.query.range;

    const likeFilter = { postId: { $ne: null } };

    if (range === "24h") {
      likeFilter.createdAt = {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      };
    }

    const topLikes = await likeModel.aggregate([
      { $match: likeFilter },
      { $group: { _id: "$postId", recentLikeCount: { $sum: 1 } } },
      { $sort: { recentLikeCount: -1 } },
      { $limit: 10 },
    ]);

    if (!topLikes.length) return res.status(200).json({ posts: [] });

    const postIds = topLikes
      .map((item) => item._id)
      .filter((id) => id !== null && id !== undefined);

    const postDocs = await postModel
      .find({ _id: { $in: postIds } })
      .select("postContent postMedia author createdAt")
      .populate("author", "username profile_picture_url")
      .lean();

    const postMap = new Map(postDocs.map((p) => [p._id.toString(), p]));

    const posts = topLikes
      .map((item) => {
        if (!item._id) return null;
        const post = postMap.get(item._id.toString());
        if (!post) return null;
        return {
          ...post,
          likeCount: item.recentLikeCount,
        };
      })
      .filter(Boolean);

    return res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};
const trendingUsers = async (req, res) => {
  try {
    const range = req.query.range;
    const currUser = req.session.userId;
    const filter = {};
    if (range === "24h") {
      const past24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: past24Hours };
    }
    const topFollowed = await followModel.aggregate([
      { $match: filter },
      { $group: { _id: "$followingId", followerCount: { $sum: 1 } } },
      { $sort: { followerCount: -1 } },
      { $limit: 10 },
    ]);
    const userIds = topFollowed.map((doc) => doc._id);

    const userDocs = await userModel
      .find({ _id: { $in: userIds } })
      .select("username profile_picture_url");

    const myFollowingDocs = await followModel.find({
      followerId: currUser,
      followingId: { $in: userIds },
    });
    const myFollowingIds = new Set(
      myFollowingDocs.map((doc) => doc.followingId.toString()),
    );

    const userDocsById = new Map(userDocs.map((u) => [u._id.toString(), u]));

    const users = topFollowed
      .map((doc) => {
        const user = userDocsById.get(doc._id.toString());
        if (!user) return null;
        return {
          _id: user._id,
          username: user.username,
          profile_picture_url: user.profile_picture_url,
          followerCount: doc.followerCount,
          isFollowing: myFollowingIds.has(user._id.toString()),
        };
      })
      .filter(Boolean);

    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

export { trendingPosts, trendingUsers };
