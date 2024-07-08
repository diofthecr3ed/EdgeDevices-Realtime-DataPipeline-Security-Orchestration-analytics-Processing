import io from 'socket.io-client';

export default function createSocketConnection(setData) {
    const socket = io("http://localhost:3000", {
        withCredentials: true,
    });


    socket.on('connect', () => {
        console.log('Connected to the server');
    });

    socket.on('update', (data) => {
        console.log('Received data:', data);
        setData(data.systemData);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from the server');
    });

    return socket;
}
