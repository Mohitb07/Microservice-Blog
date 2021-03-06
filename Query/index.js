const express = require('express')
const cors = require('cors')
const app = express();
const { default: axios} = require('axios')

app.use(express.json())
app.use(cors())

const posts = {}

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = {id, title, comments : []}
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = posts[postId]

        post.comments.push({ id, content, status})

    }

    if(type === 'CommentUpdated'){
        const {id, postId, content, status} = data;
        console.log('status updated value', status)
        const post = posts[postId]
        const comment = post.comments.find(comment => comment.id === id)

        comment.status = status
        comment.content = content
    }
}

app.get('/posts', (req, res) => {
    console.log('found /posts❤️')
    res.send(posts)
})

app.post('/events', (req, res) => {

    const { type, data } = req.body;
   
    handleEvent(type, data)
    
    res.send({})
    
}) 

app.listen(4002, async() => {
    console.log('Server is up and running at 4002')
    try{
    const res = await axios.get('http://event-bus-srv:4005/events')

    for(let event of res.data){
        console.log('Processing event', event.type)
        handleEvent(event.type, event.data)
    }
    }catch(err){
        console.log('GOT ERROR WHILE FETCHING THE CACHED EVENTS IN DATA STORE')
    }
    
})