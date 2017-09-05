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
      request("http://startupbddy.com/api.php?api_key=asd#$%23b8142hliqrirwbdvzbjfeupo&userid="+status+"", {
        json: true
      }, function (err, dta) {
        console.log(dta)
                    toretn = dta;  
                  
        io.emit('refresh feed',toretn);
        console.log('Hope - '+toretn);
      })
    });
  
  
  socket.on('disconnect', () => console.log('Client disconnected'));
});
