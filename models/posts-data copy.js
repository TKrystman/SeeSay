const mongoose=require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
    PostId: Number,
    postedBy: String,
    message: String,
    likes: Number,
    time: Date,
    imagePath: String,
    MostLikedComment: String,
    NumberOfComments:Number,
    comments: [{
        user: String,
        message: String,
        likes: Number
    }]
});

const Post = model('MyPost', postSchema);


async function addNewPost(userID, post, imageFile) {
    let userMessage = ""; // Variable to store the user message
  
    const lastPost = await Post.findOne({ postedBy: userID }).sort({ time: -1 }).exec();
    
    if (lastPost && Date.now() - lastPost.time < 24 * 60 * 60 * 1000) {
      userMessage = "24 Hours has not passed"; // Store the user message
    } else {
      const myPost = {
        postedBy: userID,
        message: post.message,
        imagePath: imageFile,
        likes: 0,
        time: Date.now(),
      };
  
      await Post.create(myPost);
    }
  
    // Display the user message
    // You can replace this with the appropriate method to show the message to the user
    alert(userMessage);
  }

  
  
  
  
    
    async function removePost(postid) {
        try {
          let data = null;
          const mongoData = await Post.findById(postid).exec();
          data = mongoData;
          console.log(postid);
          await Post.findByIdAndRemove(postid).exec();
          console.log(data);
          console.log(postid);
          return data;
        } catch (err) {
          console.log('Error: ' + err);
          throw err;
        }
      }

//needs to be an async function so we can pause execution awaiting for data
async function getPosts(n=3){
    let data=[];
    await Post.find({})
        .sort({'time': -1})
        .limit(n)
        .exec()
        .then(mongoData=>{
            data=mongoData;
        })
        .catch(err=>{
            console.log('Error:'+err)
        });
    return data;
}

async function getPost(postid){
    let data=null;
    await Post.findById(postid)
        .exec()
        .then(mongoData=>{
            data=mongoData;
        })
        .catch(err=>{
            console.log('Error:'+err)
        });
    return data;
}

async function likePost(likedPostID, likedByUser){
    // await Post.findByIdAndUpdate(likedPostID,{$inc: { likes: 1 }})
    let found

    
    await Post.findByIdAndUpdate(likedPostID,{$inc: {likes: 1}}).exec()
        .then(foundData=>found=foundData)
    // console.log(found)
}

async function likeComment(commentedPostID, likedCommentID) {
    await Post.updateOne(
        { _id: commentedPostID, 'comments._id': likedCommentID },
        { $inc: { 'comments.$.likes': 1 } }
    ).exec();
}

async function commentOnPost(commentedPostID, commentByUser, comment){
    
    // await Post.findByIdAndUpdate(likedPostID,{$inc: { likes: 1 }})
    let found
    let newComment={
        user: commentByUser,
        message: comment,
        likes: 0,
    }
    try { //means program will still run if any errors occur
        await Post.findByIdAndUpdate(commentedPostID, { $push: { comments: newComment } }).exec();
      
        // console.log(found);
      } catch (error) {
        // Handle any errors that occurred during the process
        console.error(error);
      }
}
async function changePost(postid, updatedMessage) {
    await Post.findByIdAndUpdate(
      postid,
      { message: updatedMessage }
    ).exec();
  }

 

module.exports = { addNewPost, getPosts, getPost, likePost, commentOnPost, likeComment, changePost, removePost };