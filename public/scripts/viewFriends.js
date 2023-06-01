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
        li.classList.add('list-item');
        UsersList.appendChild(li)
    })
}
var img = document.createElement('img');
var username=user.username
function renderPost(user){
    // console.log(user._id.toString(), user.likes);
    let li=document.createElement('li')
    let liText=document.createElement('p')

    
    

    img.src = "../Images/Thumbsup.png"; 
    liText.textContent = `${user.username}`;
 
    li.appendChild(liText);

    //create a 'like' button
  
    //create a 'view and comment' button
    let viewButton = document.createElement('button');
    viewButton.textContent = 'Send Request';
    viewButton.classList.add('view-friends-button');
    
    // Set the data attribute with the user ID
    viewButton.setAttribute('data-user-id', user.username.toString());
    
    viewButton.addEventListener('click', (event) => {
        processView(event, user.username.toString()); // Pass the user ID as an argument
    });
    // show image if present
    renderImage(li, user)
    
    li.appendChild(liText)
    
    li.appendChild(viewButton)
    // grab the username list
   
        return li;
      

   

}



function renderImage(li, user){
    if(user.profilePic){
        let postImage=document.createElement('img')
        postImage.src=user.profilePic
        postImage.alt="temporary alt tag"
        postImage.classList.add("user-image-thumbnail")
        li.appendChild(postImage)
    } else {
        let noPostImage=document.createElement('p')
        noPostImage.textContent="no image"
        li.appendChild(noPostImage)
    }
}


function processView(event, user){
    console.log('yes');

   
   

  
    console.log(user);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            receiverUserId: user
        })
    };

    fetch('/sendReq', options)
        .then(response => response.json())
        .then(fetchedData => {
            receiverUserId = fetchedData.user;
            handleServerData();
    
        });
}

//if user press 'new user' button, direct them to the new user page
function newPostPage(){
    window.location=window.location=window.location.origin+'/newpost.html'
}