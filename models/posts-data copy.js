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

        //checks when the user last posted 
      const lastPost = await Post.findOne({ postedBy: userID }).sort({ time: -1 }).exec();
  //checks for if 24 hours have elapsed since last post
      if (lastPost && Date.now() - lastPost.time < 24 * 60 * 60 * 1000) {
        console.log("too early"); //going to change this to show the user something
        return;
      }
  //if not they can post
      const myPost = {
        postedBy: userID,
        message: post.message,
        imagePath: imageFile,
        likes: 0,
        time: Date.now(),
      };
  
      await Post.create(myPost);
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

async function likeComment(commentedPostID, likedPostID){
    // await Post.findByIdAndUpdate(likedPostID,{$inc: { likes: 1 }})
    let found
    
    // const itemId = 2;
    // // const query = {
    // //    commentedPostID._id:commentedPostID,
    // //    likedPostID._id: likedPostID
    // //  };
    // Post.findOne(likedPostID).then(doc => {
    //   comments = doc.comments.id(commentedPostID );
      
    //  likes["0"] =  '1';
    //   doc.save();
    
    //   //sent respnse to client
    // }).catch(err => {
    //   console.log('err')
    // });


    await Post.findByIdAndUpdate(likedPostID, commentedPostID,{$inc: {likes: 1}}).exec()
        .then(foundData=>found=foundData)
    // console.log(found)
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
async function changePost(postId, updatedMessage) {
    
     await Post.findByIdAndUpdate(
        postId,
        { $set: { message: updatedMessage } }).exec();
  }


module.exports = { addNewPost, getPosts, getPost, likePost, commentOnPost, likeComment, changePost };