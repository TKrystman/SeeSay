/*console.log("Simple Posting App")

//Data structures
const user={
    userID: 0,
    NoPosts: 0,
    Email: "",
    Bio: ""
}

const Post={
    userID: 0,
    PostId: 1,
    Image: "",
    numberComments:7,
    MLcomment: ""
    
}

//get a handle and add event listeners to the word input form
let words=document.querySelector('#words')
words.addEventListener('input',checkWords)
words.addEventListener('keypress',checkIfReturn)
let currentWords=''

//temporary handles and event listeners for old post and fetch
let getPosts=document.querySelector('#get-posts')
getPosts.addEventListener('click',fetchData)

//get a handle and add event listeners to the 'post' button
let postButton=document.querySelector('#post-button')
postButton.addEventListener('click',postWords)

//basic post database (empty)
let recentPosts=[]
let maxRecents=3
let nextPostID=0


//get a handle on the recent-posts UL
let recentPostList=document.querySelector("#recent-posts")

//set a timer to constantly refresh the age of posts
let updateTimer=setInterval(updateRecentPosts,1000)

//handle enetr key on input form
function checkIfReturn(event){
    if(event.key === "Enter" || event.which===13){
        postWords()
        event.preventDefault();
    }
}

//process input words top limit to 5 words
function checkWords(event){
    currentWords=event.target.value
    console.log(currentWords)
}

//create temporary data structure for our post, and update recent posts list (database)
function postWords(){
    if(currentWords.length==0){
        console.log('no words to post')
    } else {
        let myPost={
            postID: -1, //nextPostID++,
            userID: user.userID,
            post: currentWords,
            likes: 0,
            time: Date.now(),
        }
        postTheseWords(myPost)
        // recentPosts.unshift(myPost)
        // if(recentPosts.length>maxRecents){
        //     recentPosts.pop()
        // }
        clearWordInput()
        // updateRecentPosts()
    }
}

//helper function
function clearWordInput(){
    words.value=''
    currentWords=''
}

// function to handle the posting to the backend
function postTheseWords(wordsToPost){
    console.log("posting...")
    console.log(wordsToPost)
    let options={
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(wordsToPost)
    }
    fetch('/newpost',options)
    .then(response=>response.json())
    .then(serverData=>handleDataFromServer(serverData))
    console.log("... Posted!")
}


//update the HTML for the recent posts list
function updateRecentPosts(){
    //empty the UL of recent posts
    recentPostList.innerHTML=''
    recentPosts.forEach(function(post){
        // Create a new, empty li
        let li=document.createElement('li')
        //calculate ellaped mins and secs since post time
        let now=Date.now()
        let ellapsed=new Date(now-post.time)
        let ellapsedSecs=ellapsed.getSeconds()
        let ellapsedMins=ellapsed.getMinutes()
        ellapsedSecs=String(ellapsedSecs).padStart(2, '0');
        //create a 'like' button
        let button=document.createElement('button')
        button.textContent='like'
        button.addEventListener('click',processLike)
        //add a unique attribute for the like button so it knows which post it belongs to
        button.setAttribute('data-post-id',post.postID.toString())
        //build the recent post text and add it, with the button, as new li
        let liText=document.createElement('p')
        liText.textContent=`${post.post} (user ${post.userID}) [${ellapsedMins}:${ellapsedSecs} ago (m:s)] [likes:${post.likes}]`
        li.appendChild(liText)
        li.appendChild(button)
        //add the li to the ul
        recentPostList.appendChild(li)
    })
}

//function to deal with a like button being pressed on a post
function processLike(event){
    let likedPostId=event.target.getAttribute("data-post-id");
    console.log('you liked '+likedPostId)
    let matchedPost=recentPosts.find(post=>post.postID==likedPostId)
    if(matchedPost){ //check that it has found a match, if it did not this will be undefined
        matchedPost.likes++
        updateRecentPosts()
    } else {
        //no matched post
    }

}

function fetchData(){
    let numberToFetch=3
    let getPostsParam=`/?qty=${numberToFetch}`
    fetch('/getposts'+getPostsParam)
        .then(response=>response.json())
        .then(fetchedData=>handleDataFromServer(fetchedData))
}

function handleDataFromServer(data){
    console.log('data received from server ...')
    console.log(data)
    recentPosts=data.posts
    updateRecentPosts()
}*/