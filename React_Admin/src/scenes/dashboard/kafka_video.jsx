import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const  KafkaVideo = () => {
  const videoRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    newSocket.on('video-frame', (frame) => {
      const blob = new Blob([frame], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);

      if (videoRef.current) {
        videoRef.current.src = url;
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO error:', err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="App">
      <video ref={videoRef} controls onCanPlay={() => handlePlay()} />
      <button onClick={handlePlay}>Play Video</button>
    </div>
  );
};

export default KafkaVideo;
