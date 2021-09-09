const express = require('express')
const cors = require('cors')
const app = express();

app.use(express.json())
app.use(cors())

const posts = {}

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {

    const { type, data } = req.body;

    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = {id, title, comments : []}
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = posts[postId]

        post.comments.push({ id, content}, status)

    }

    if(type === 'CommentUpdated'){
        const {id, postId, content, status} = data;

        const post = posts[postId]
        const comment = post.comments.find(comment => comment.id === id)

        comment.status = status
        comment.content = content
    }
    
    console.log(posts)

    res.send({})
    
}) 

app.listen(4002, () => {
    console.log('Server is up and running at 4002')
})