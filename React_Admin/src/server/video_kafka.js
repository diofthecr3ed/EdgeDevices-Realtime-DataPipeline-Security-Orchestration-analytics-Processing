import { KafkaClient, Consumer } from 'kafka-node';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://10.1.32.176:5100",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const client = new KafkaClient({ kafkaHost: '10.1.33.94:9092' });
client.on('ready', () => {
  console.log('Connected to Kafka broker');
});

const consumer = new Consumer(
  client,
  [{ topic: 'GATE1-NODE', partition: 0 }],
  {
    groupId: 'node_consumer',
    autoCommit: true
  }
);

consumer.on('error', (err) => {
  console.error('Kafka consumer error:', err);
});

io.on('connection', (socket) => {
  console.log('Socket.IO connection established');

  consumer.on('message', (message) => {
    const frame = Buffer.from(message.value, 'base64'); // Assuming frames are base64 encoded
    socket.emit('video-frame', frame);
  });

  consumer.on('error', (err) => {
    console.error('Kafka consumer error:', err);
  });
});

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
