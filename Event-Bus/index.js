const express = require('express')
const { default: axios } = require('axios');
const app = express();

app.use(express.json())
const events = []
app.post('/events', (req, res) => {
    const event = req.body;
    console.log('REQUEST BODY', req.body)
    events.push(event)
    try {
        axios.post('http://posts-clusterip-srv:4000/events', event)
        axios.post('http://comments-srv:4001/events', event)
        axios.post('http://query-srv:4002/events', event)
        axios.post('http://moderation-srv:4010/events', event)
    }catch(err){
        console.log('ERROR ON EVENT BUS',err)
    }
    

    res.status({status : 'OK'})
})

app.get('/events', (req, res) => {
    res.send(events)
})

app.listen(4005, () => {
    console.log('server is up and running at port 4005')
})