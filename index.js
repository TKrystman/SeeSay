const express=require('express')
const app = express()
app.listen(3000, ()=> console.log('listening at port 3000'))
const mongoose=require('mongoose');
const multer=require('multer');
//serve unspecified static pages from our public dir
app.use(express.static('public'))
//make express middleware for json available
app.use(express.json())

require('dotenv').config();
const mongoDBPassword=process.env.MYMONGOPASSWORD
const sessionSecret=process.env.MYSESSIONSECRET

//allows us to process post info in urls
app.use(express.urlencoded({extended: false}));
mongoose.connect(`mongodb+srv://CCO6005-00:${mongoDBPassword}@cluster0.lpfnqqx.mongodb.net/seesay?retryWrites=true&w=majority`)
const path = require('path');

//importing our own node module
const users=require('./models/users')
const upload = multer({ dest: './public/uploads/' })
//consts to hold expiry times in ms
const threeMins = 1000 * 60 * 3;
const oneHour = 1000 * 60 * 60;

//use the sessions module and the cookie parser module
const sessions = require('express-session');
const cookieParser = require("cookie-parser");


const postData=require('./models/posts-data copy')

//make cookie parser middleware available
app.use(cookieParser());

//load sessions middleware, with some config
app.use(sessions({
    secret: "a secret that only i know",
    saveUninitialized:true,
    cookie: { maxAge: threeMins },
    resave: false 
}));

app.set('view engine', 'ejs');

//test that user is logged in with a valid session
function checkLoggedIn(request, response, nextAction){
    if(request.session){
        if(request.session.userid){
            nextAction()
        } else {
            request.session.destroy()
            return response.redirect('./login.html')
        }
    }
}

//controller for the main app view, depends on user logged in state
app.get('/app', checkLoggedIn, (request, response)=>{
    //response.redirect('./register.html')
    response.sendFile(path.resolve(__dirname,'Views/pages/viewposts.html'))
})

//controller for logout
app.post('/logout', async (request, response)=>{
    
    await users.setLoggedIn(request.session.userid,false)
    request.session.destroy()
    await console.log(users.getUsers())
    response.redirect('./login.html')
})

//controller for login
app.post('/login', async (request, response)=>{
    console.log(request.body)
    let userData=request.body
    console.log(userData)
    
    if(await users.findUser(userData.username)){
        console.log('user found')
        if(await users.checkPassword(userData.username, userData.password)){
            console.log('password matches')
            request.session.userid=userData.username
            await users.setLoggedIn(userData.username, true)
            response.redirect('/app')
        } else {
            console.log('password wrong')
            response.redirect('./login.html')
        }
    }else {
        console.log('no such user')
        response.redirect('./login.html')
    }
    console.log(users.getUsers())
})

app.get('/newpostpage', checkLoggedIn, (request, response)=>{
    response.render('pages/newpost');
})

app.post('/newpost', upload.single('myImage'), async (request, response) =>{
    console.log(request.file)
    let filename=null
    if(request.file && request.file.filename){ //check that a file was passes with a valid name
        filename='uploads/'+request.file.filename
    }
    await postData.addNewPost(request.session.userid, request.body, filename)
    response.redirect('/app')
})
app.post('/changeProf', upload.single('ImageFile'), async (request, response) =>{
    console.log(request.file)
    let filename=null
    if(request.file && request.file.filename){ //check that a file was passes with a valid name
        filename='uploads/'+request.file.filename
    }
    await users.changeProfile(request.session.userid, request.body, filename)
 response.redirect('/Profile')
})

// async/await version of /getposts controller using Mongo
app.get('/getposts',async (request, response)=>{
    response.json(
        {posts:await postData.getPosts(500)}
    )
})


//controller for handling a post being liked
app.post('/like', async (request, response)=>{
    //function to deal with a like button being pressed on a post
    likedPostID=request.body.likedPostID
    likedByUser=request.session.userid
    await postData.likePost(likedPostID, likedByUser)
    // console.log(likedByUser+" liked "+likedPostID)
    response.json(
        {posts:await postData.getPosts(500)}
    )
})

//controller for comment a post being liked
app.post('/comLike', async (request, response)=>{
    //function to deal with a like button being pressed on a post
    likedCommentID=request.body.likedCommentID
    commentedPostID=request.body.postid
    await postData.likeComment(likedCommentID, commentedPostID )

    response.json(
        {posts:await postData.getPosts(500)}
    )
})

app.post('/comment', async (request, response)=>{
    //function to deal with a like button being pressed on a post
    let commentedPostID=request.body.postid
    let comment=request.body.message
    let commentByUser=request.session.userid
    await postData.commentOnPost(commentedPostID, commentByUser, comment)
    // response.json({post: await postData.getPost(commentedPostID)})
    response.redirect('/app')
})

app.post('/getonepost', async (request, response) =>{
    // console.log(request.file)
    let postid=request.body.post
    console.log(request.body)
    response.json({post: await postData.getPost(request.body.post)})
})

app.get('/getposts', async (request, response)=>{
    response.json(
        {posts: await postData.getPosts(500)}
        
    )
})

//controller for registering a new user
app.post('/register', async (request, response)=>{
    console.log(request.body)
    let userData=request.body
    // console.log(userData.username)
    if(await users.findUser(userData.username)){
        console.log('user exists')
        response.json({
            status: 'failed',
            error:'user exists'
        })
    } else {
        users.newUser(userData.username, userData.password)
        response.redirect('./registered.html')
    }
    console.log(users.getUsers())
})

app.get('/Profile', checkLoggedIn, async (request, response) =>{
    var userData = await users.findUser(request.session.userid)
    response.render('pages/Profile', {
     user: userData,
    });
});