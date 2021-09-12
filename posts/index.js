const express = require('express')
const cors = require('cors')

const app = express();

const { randomBytes } = require('crypto');
const { default: axios } = require('axios');

const posts = {}

app.use(express.json())
app.use(cors())

app.get('/posts', (req, res) => {
    res.send(posts)
})


app.post('/posts', async(req, res) => {
    const id = randomBytes(4).toString('hex')
    const { title } = req.body;

    posts[id] = {
        id, title
    }

    try {
        await axios.post('http://event-bus-srv:4005/events', {
            type : 'PostCreated',
            data : {
                id, title
            }
        })
    }catch(err){
        console.log('GOT ERROR ON POST CREATION', err)
    }
    
    res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
    console.log('Event received', req.body.type)

    res.send({})
    
})

app.listen(4000, () => {
    console.log('v2')
    console.log('server is up and running')
})