let allUsers=[]

let UsersList=document.querySelector('#view-friends')

fetch('/getUsers')
    .then(response=>response.json())
    .then(fetchedData=>{
        allUsers=fetchedData.users
        console.log(fetchedData.users)
        handleServerData()
    })

function handleServerData(){
    UsersList.innerHTML=''
    allUsers.forEach(function(user){
        let li=renderPost(user)
        UsersList.appendChild(li)
    })
}
var img = document.createElement('img');

function renderPost(user){
    // console.log(user._id.toString(), user.likes);
    let li=document.createElement('li')
    let liText=document.createElement('p')
    let username=user.username
    
    if(username.length > 0){

        renderUsers(li, [username[0]]) //only render first comment
        
    }

    img.src = "../Images/Thumbsup.png"; 
    liText.textContent = ` (${user.username})  Likes: [${user.likes}]`;
 
    li.appendChild(liText);

    //create a 'like' button
    let button=document.createElement('button')
    button.textContent='like'
    button.addEventListener('click',processLike)
    //add a unique attribute for the like button so it knows which user it belongs to
    button.setAttribute('data-user-id',user._id.toString())

    //create a 'view and comment' button
    let viewButton=document.createElement('button')
    viewButton.textContent='view and comment'
    viewButton.addEventListener('click',processView)
    //add a unique attribute for the like button so it knows which user it belongs to
    viewButton.setAttribute('view-user-id',user._id.toString())
    
    // show image if present
    renderImage(li, user)
    
    li.appendChild(liText)
    li.appendChild(button)
    li.appendChild(viewButton)
    // grab the username list
   
        return li;
      

   

}



function renderImage(li, user){
    if(user.imagePath){
        let postImage=document.createElement('img')
        postImage.src=user.imagePath
        postImage.alt="temporary alt tag"
        postImage.classList.add("user-image-thumbnail")
        li.appendChild(postImage)
    } else {
        let noPostImage=document.createElement('p')
        noPostImage.textContent="no image"
        li.appendChild(noPostImage)
    }
}

function renderUsers(li, username){
    //add a list of username

    let commentsUL=document.createElement('ul')
 
            username.forEach(function(usermame){
                let commentLi=document.createElement('li')
                let commentLiText=document.createElement('p')
                commentLiText.textContent=`(by ${usermame.user}) `
                //add like button and code to handle like later
                commentLi.appendChild(commentLiText)
                commentsUL.appendChild(commentLi)
                
            })
           
            li.appendChild(commentsUL)
            
            
            
}

function processLike(event){
    let likedPostId=event.target.getAttribute("data-user-id");
    // console.log('you liked '+likedPostId)
    let options={
        method: 'user',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            likedPostID:likedPostId
        })
    }
    fetch('/like',options)
        .then(response=>response.json())
        .then(fetchedData=>{
            allUsers=fetchedData.posts
            handleServerData()
        })
}

// If view user button is pressed, grab its user id attribute and 
// direct the user to the view user page with this added in 
// url search params
function processView(event){
    let viewPostId=event.target.getAttribute("view-user-id");
    console.log(window.location.origin+'/viewpost.html?user='+viewPostId)
    window.location=window.location.origin+'/viewpost.html?user='+viewPostId
}

//if user press 'new user' button, direct them to the new user page
function newPostPage(){
    window.location=window.location=window.location.origin+'/newpost.html'
}