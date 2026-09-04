import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import homeController from "../controllers/homeController.js";
import createPostController from "../controllers/createPostController.js";
import { likePost, unlikePost } from "../controllers/likePostController.js";
import followUser from "../controllers/followUserController.js";
import createComment from "../controllers/createCommentController.js";
import fetchComments from "../controllers/fetchCommentsController.js";
import fetchLikes from "../controllers/fetchLikesController.js";
import { findUsers } from "../controllers/searchController.js";
import {
  fetchFollowersList,
  fetchFollowingList,
} from "../controllers/fetchFollowersList.js";
import fetchUserController from "../controllers/fetchUserController.js";
import { getLoggedInUserDetails } from "../controllers/fetchCurrentUserDetails.js";
import logoutUser from "../controllers/logoutUser.js";
import fetchProfile from "../controllers/fetchProfileController.js";
import { uploadPP } from "../cloudinary-config.js";
import { unfollowUser } from "../controllers/unfollowUser.js";
import {
  updateUsername,
  updatePP,
  updatePassword,
} from "../controllers/updateUser.js";
import deleteAccount from "../controllers/deleteAccount.js";
import {
  trendingPosts,
  trendingUsers,
} from "../controllers/trendingController.js";
const Router = express.Router();
Router.get("/home", isAuthenticated, homeController);
Router.post(
  "/home",
  isAuthenticated,
  uploadPP.single("image"),
  createPostController,
);
Router.post("/likePost", isAuthenticated, likePost);
Router.post("/followUser", isAuthenticated, followUser);
Router.post("/createComment", isAuthenticated, createComment);
Router.get("/fetchComments", isAuthenticated, fetchComments);
Router.get("/getFollowers", fetchFollowersList);
Router.get("/getFollowing", fetchFollowingList);
Router.post("/deleteLike", unlikePost);
Router.get("/me", isAuthenticated, getLoggedInUserDetails);
Router.post("/logout", logoutUser);
Router.get("/user", isAuthenticated, fetchProfile);
Router.get("/fetchLikes", fetchLikes);
Router.get("/searchUsers", isAuthenticated, findUsers);
Router.get("/trendingPosts", isAuthenticated, trendingPosts);
Router.get("/trendingUsers", isAuthenticated, trendingUsers);

Router.post("/unfollowUser", isAuthenticated, unfollowUser);

Router.post("/updateUsername", isAuthenticated, updateUsername);
Router.post("/updatePassword", isAuthenticated, updatePassword);
Router.post(
  "/updateProfilePicture",
  isAuthenticated,
  uploadPP.single("image"),
  updatePP,
);

Router.post("/deleteAccount", isAuthenticated, deleteAccount);

export default Router;
