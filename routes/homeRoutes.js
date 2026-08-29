import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import homeController from "../controllers/homeController.js";
import createPostController from "../controllers/createPostController.js";
import { likePost, unlikePost } from "../controllers/likePostController.js";
import followUser from "../controllers/followUserController.js";
import createComment from "../controllers/createCommentController.js";
import fetchComments from "../controllers/fetchCommentsController.js";
import {
  fetchFollowersList,
  fetchFollowingList,
} from "../controllers/fetchFollowersList.js";
import fetchUserController from "../controllers/fetchUserController.js";
import { getLoggedInUserDetails } from "../controllers/fetchCurrentUserDetails.js";
import logoutUser from "../controllers/logoutUser.js";
import fetchProfile from "../controllers/fetchProfileController.js";
const Router = express.Router();
Router.get("/home", isAuthenticated, homeController);
Router.post("/home", isAuthenticated, createPostController);
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

export default Router;
