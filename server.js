'use strict';

const express = require('express');
const socketIO = require('socket.io');
var mysql  =  require("mysql");
const path = require('path');
var disposableEmail = require('temporary-email-address-validator');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);
io.set('origins', '*:*');



io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('status added',function(status){

    console.log('atleast status on');
      add_status(status,function(res){
        if(res){
            io.emit('refresh feed','true');
        } else {
            io.emit('error');
        }
      });
    });
  
  
  socket.on('disconnect', () => console.log('Client disconnected'));
});
var add_status = function (status,callback) {
    console.log('status - '+status);
    
  var result = disposableEmail.validate(status);
  console.log(result)
  return result;

}
//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
