import mongoose from "mongoose";
import likeModel from "./models/likeModel.js";
import { configDotenv } from "dotenv";
configDotenv();

await mongoose.connect(process.env.URI);

await likeModel.collection
  .dropIndex("postId_1_likedBy_1")
  .catch((e) => console.log(e.message));
await likeModel.collection
  .dropIndex("commentId_1_likedBy_1")
  .catch((e) => console.log(e.message));

await likeModel.syncIndexes();

console.log("Indexes now:", await likeModel.collection.indexes());
process.exit(0);
