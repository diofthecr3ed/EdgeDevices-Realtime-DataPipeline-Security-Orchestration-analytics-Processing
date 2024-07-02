const express = require('express');
const mysql = require('mysql');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://10.1.32.233:5100', // Allow your frontend origin
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }
});

const db1 = mysql.createPool({
  host: 'localhost',
  user: 'test_user',
  password: 'Kugu@1208',
  database: 'main_iot_data'
});

const emitData = () => {
  db1.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database', err);
      return;
    }
    console.log('Connected to the database');
    
    db1.query('SELECT * FROM nodedata ORDER BY id DESC LIMIT 2', (err, result) => {
      connection.release();
      if (err) {
        console.error('Database query error:', err);
        return;
      }
      if (result.length > 0) {
        console.log('Emitting data:', result);
        io.emit('update', { systemData: result });
      }
    });
  });
};

setInterval(emitData, 7000); // Emit data every 7 seconds (7000 milliseconds)

io.on('connection', (socket) => {
  console.log('A user connected');
  emitData();

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
