
const posts=[]

function addNewPost(userID, post){
    let myPost={
      
        message: post.message,
        likes: 0,
        time: Date.now(),
        userID: 0,
        PostId: 1,
        Image: "",
        numberComments:0,
        MLcomment: ""
    }
    posts.unshift(myPost)
}

function getPosts(n=3){
    return posts.slice(0,n)
}



module.exports={addNewPost, getPosts}