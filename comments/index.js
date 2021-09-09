const express = require('express')
const { randomBytes } = require('crypto')
const cors = require('cors')
const { default: axios } = require('axios');

const app = express();

app.use(cors())
app.use(express.json())

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async(req, res) => {
    const commentId = randomBytes(4).toString('hex')
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || []

    comments.push({id: commentId, content, status: 'pending'})
    commentsByPostId[req.params.id] = comments

    try {
        await axios.post('http://localhost:4005/events', {
            type : 'CommentCreated',
            data : {
               id : commentId,
               content,
               postId : req.params.id,
               status: 'pending'
            }
        })
    }catch(err){
        console.log('GOT ERROR', err)
    }
    
    res.status(201).send(comments)

})

app.post('/events', async(req, res) => {
    console.log('Event Recieved', req.body.type)

    const {type, data} = req.body;

    if(type === 'CommentModerated'){
        const {id, postId, status, content} = data;

        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => comment.id === id)
        comment.status = status;

        try {
            await axios.post('http://localhost:4005/events', {
                type: 'CommentUpdated',
                data: {
                    id,
                    postId,
                    status,
                    content
                }
            })
        }   catch(err){
            console.log(err)
        } 
    }
    
    res.send({})
    
})

app.listen(4001, () => {
    console.log('Listening on 4001')
})