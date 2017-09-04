'use strict';

const express = require('express');
const socketIO = require('socket.io');
var mysql  =  require("mysql");
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);
io.set('origins', '*:*');

var pool    =    mysql.createPool({
      host              :   '148.66.136.214',
      user              :   'pupskee',
      password          :   'SOW#J@8~xfiUEBK+IAL',
      database          :   'pupskee',
      debug             :   true
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('status added',function(status){
      add_status(status,function(res){
        if(res){
            io.emit('refresh feed',status);
        } else {
            io.emit('error');
        }
      });
    });
  
  
  socket.on('disconnect', () => console.log('Client disconnected'));
});
var add_status = function (status,callback) {
    pool.getConnection(function(err,connection){
        if (err) {
          callback(false);
          return;
        }
    connection.query("INSERT INTO `status` (`s_text`) VALUES ('"+status+"')",function(err,rows){
            connection.release();
            if(!err) {
              callback(true);
            }
        });
     connection.on('error', function(err) {
              callback(false);
              return;
        });
    });
}
//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
