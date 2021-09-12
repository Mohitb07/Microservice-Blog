const express = require('express')
const app = express()
const cors = require('cors')
const { default: axios } = require('axios');

app.use(cors())
app.use(express.json())

app.post('/events', async(req, res) => {
    console.log('REQUEST BODY', req.body)
    const {type, data} = req.body;

    if(type === 'CommentCreated'){
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        try{
            await axios.post('http://event-bus-srv:4005/events', {
                type: 'CommentModerated',
                data: {
                    id: data.id,
                    postId:data.postId,
                    status,
                    content: data.content
                }
            })
        }catch(err){
            console.log('ERROR ON COMMENT MODERATION', err)
        }
    }
    res.send({})
})


app.listen(4010,() => {
    console.log(`listening to 4010`)
})