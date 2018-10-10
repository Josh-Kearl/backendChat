const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');



const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, 'public')));



let clientCount = 0;
let disconnectMsg = `User disconnected, Users in chat: ${clientCount}`;
let clientArray = [];

// const setUserName = () =>{
//     username = $('#username').val('');
//   } 



io.on('connection', (socket) => {
    clientCount++;
    clientArray.push(clientCount);
    
    console.log(clientArray);


    socket.broadcast.emit('user added', {
        clientArray: clientArray,
        clientCount: clientCount
    })
    console.log(`User: ${clientCount} has connected`);

    socket.on('chat message', (msg)=>{
        
        console.log('message: ' + msg);
    io.emit('chat message', msg);

    });
    socket.on('disconnect', ()=>{
        clientCount--;
        
        socket.broadcast.emit('user left', {
            clientArray: clientArray,
            clientCount: clientCount
        });   
        clientArray.pop();
        console.log(disconnectMsg);
        console.log(clientArray);
    });

    

});


http.listen(port, ()=>{
    console.log(`listening on port : ${port}`);
});