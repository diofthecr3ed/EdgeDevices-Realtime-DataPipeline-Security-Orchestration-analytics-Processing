import express from 'express';
import mysql from 'mysql';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://10.1.32.104:5100', // Allow your frontend origin
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

let currentId = 100; // Start from ID 100

const emitData = () => {
  db1.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database', err);
      return;
    }
    console.log('Connected to the database');
    
    const query = `SELECT * FROM nodedata WHERE id <= ? ORDER BY id DESC LIMIT 10`;
    db1.query(query, [currentId], (err, result) => {
      connection.release();
      if (err) {
        console.error('Database query error:', err);
        return;
      }
      if (result.length > 0) {
        console.log('Emitting data:', result);
        io.emit('update', { systemData: result });
        currentId -= 10; // Decrement by 2 for the next fetch
      } else {
        console.log('No more data to fetch.');
        clearInterval(emitInterval); // Stop emitting if no more data
      }
    });
  });
};

const emitInterval = setInterval(emitData, 7000); // Emit data every 7 seconds (7000 milliseconds)

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
