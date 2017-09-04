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

var connection    =    mysql.createConnection({

      host              :   '148.66.136.214',
      user              :   'pupskee',
      password          :   'SOW#J@8~xfiUEBK+IAL',
      database          :   'pupskee',
    port : 3306
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('status added',function(status){
    connection.connect();
    console.log('atleast status on');
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
    console.log('status - '+status);

    var sql = "INSERT INTO `status` (`s_text`) VALUES ('"+status+"')";
    connection.query(sql, function (err, result) {
            if(!err) {
              callback(true);
            }else{
      console.log(err)};
    });
 
  

}
//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
