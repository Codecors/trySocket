'use strict';

const express = require('express');
const socketIO = require('socket.io');
var mysql  =  require("mysql");
var request = require('xhr-request');
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
    var toretn;
  var result = disposableEmail.validate(status);
    if(result){
      request('https://hunter.io/trial/v2/email-verifier?email="+status+"&format=json', {
        json: true
      }, function (err, dta) {
        if (err) throw err
                  if (dta.data.score < 50) {
                    console.log(dta.data)
                    toretn = 'false';  
                  }else{
                    toretn = 'true'; 
                  }

      })
    }else{
      toretn = 'false'; 
    }
    io.emit('refresh feed','{result:"'+toretn+'"}');
    console.log('Hope - '+toretn);

    });
  
  
  socket.on('disconnect', () => console.log('Client disconnected'));
});
