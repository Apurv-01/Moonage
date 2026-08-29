import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});
likeSchema.index({postId:1,likedBy:1},{unique:true});
export default mongoose.model("Like",likeSchema);