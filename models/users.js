const mongoose=require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    loggedin: Boolean,
    profilePic: String,
    bio: String,
    requests: [{
        user: String,
    }],
    friends: [{
        user: String,
      
    }]
});

const User = model('User', userSchema);


    async function newUser(username, password){
        const user={username:username, password:password, loggedin:false}
        // users.push(user)
        await User.create(user)
        .catch(err=>{
            console.log('Error:'+err)
        });
    }

    // function getUsers(){
    //     return users
    // }

    async function getUsers(){
        let data=[];
        await User.find({})
            .exec()
            .then(mongoData=>{
                data=mongoData;
            })
            .catch(err=>{
                console.log('Error:'+err)
            });
        return data;
    }

   



    async function findUser(userToFind){
        let user=null
        await User.findOne({username:userToFind}).exec()
            .then(mongoData=>{
                user=mongoData;
            })
            .catch(err=>{
                console.log('Error:'+err)
            });
        return user;
    }

    async function checkPassword(username, password){
        let user=await findUser(username)
        if(user){
            // console.log(user, password)
            return user.password==password
        }
        return false
    }

    async function setLoggedIn(username, state){
        let user=await findUser(username)
        if(user){
            user.loggedin=state
            user.save()
        }
    }

    async function isLoggedIn(username){
        let user=await findUser(username)
        if(user){
            return user.loggedin=state
        }
        return false
    }

    //for updating BIO and profile pic
    async function changeProfile(user, data, ImageFile){

      
        console.log(ImageFile);

      
//update profile pic
        await User.findOneAndUpdate(
            {username: user}, 
            {profilePic: ImageFile},
            
        ).
        exec()
        //update bio
        await User.findOneAndUpdate(
             {username: user}, 
             {bio: data.Bio},
            ).exec()

           

     }
     //Change the password
     async function changePass(user, data){

//same way as the bio but using the password element of the user instead
            await User.findOneAndUpdate(
                {username: user}, 
                {password: data.password},

            ).exec()

     }
     //send request by getting user id and one you want to request
     async function sendReq(senderUsername, receiverUserId) {
    const sender = await findUser(senderUsername);
    const receiver = await User.findById(receiverUserId); 
    console.log(senderUsername, receiverUserId);
    if (sender && receiver) {
        receiver.requests.push({ user: senderUsername });
        await receiver.save();
       
    }
}
    
    async function acceptReq(receiverUsername, senderUsername) {
      
        const receiver = await findUser(receiverUsername);
        const sender = await findUser(senderUsername);
        if (receiver && sender) {
          //for when both users are friens push both onto friends list
            receiver.requests = receiver.requests.filter(request => request.user !== senderUsername);
    
       
            receiver.friends.push({ user: senderUsername });
    
          
            sender.friends.push({ user: receiverUsername });
    //save 
            await receiver.save();
            await sender.save();
        }
    }

    
    module.exports={
        newUser,
        getUsers,
        findUser,
        checkPassword,
        setLoggedIn,
        isLoggedIn,
        changeProfile,
        sendReq,
        acceptReq,
        changePass,
    }