let allUsers=[]

let UsersList=document.querySelector('#view-friends')
//get the user array
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

    
    

    //img.src = "../Images/Thumbsup.png"; 
    liText.textContent = `${user.username}`;
 
    li.appendChild(liText);

    //create a 'like' button
  
    //create a 'send request' button
    let viewButton = document.createElement('button');
    viewButton.textContent = 'Send Request';
    viewButton.classList.add('view-friends-button');
    
   
    viewButton.setAttribute('data-user-id', user.username.toString());
    
    viewButton.addEventListener('click', (event) => {
        processView(event, user.username.toString()); 
    });
    
    renderImage(li, user)
    
    li.appendChild(liText)
    
    li.appendChild(viewButton)

   //when outputting output as a list
        return li;
      

   

}


//render their profile picrture
function renderImage(li, user){
    if(user.profilePic){
        let postImage=document.createElement('img')
        postImage.src=user.profilePic
        postImage.alt="temporary alt tag"
        //for css purposes
        postImage.classList.add("user-image-thumbnail")
        li.appendChild(postImage)
    } else {
        let noPostImage=document.createElement('p')
        noPostImage.textContent="no image"
        li.appendChild(noPostImage)
    }
}


function processView(event, user){
    //its working
    console.log('yes');

   
   

  //user to request
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
//send the request
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