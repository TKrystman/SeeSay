const express=require('express')
const app = express()
app.listen(3000, ()=> console.log('listening at port 3000'))

//serve unspecified static pages from our public dir
app.use(express.static('public'))
//make express middleware for json available
app.use(express.json())

//allows us to process post info in urls
app.use(express.urlencoded({extended: false}));

const path = require('path');

//importing our own node module
const users=require('./users.js')



const postData=require('./posts-data.js')


    app.post('/newpost',(request, response) =>{
        console.log(request.body)
        console.log(request.session)
        postData.addNewPost(request.session, request.body)
        response.redirect('/postsuccessful.html')
    })
    

app.get('/getposts',(request, response)=>{
    response.json(
        {posts:postData.getPosts(5)}
        
    )
})
