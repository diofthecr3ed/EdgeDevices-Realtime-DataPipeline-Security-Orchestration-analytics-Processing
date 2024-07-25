import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const KafkaVideo = () => {
  const videoRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [playRequested, setPlayRequested] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    newSocket.on('video-frame', (frameBytes) => {
      const frameData = new Uint8Array(frameBytes);
      setVideoData(frameData);

      // Start playback only when play is requested and video is not already playing
      if (playRequested && !isPlaying && videoRef.current) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error('Video play error:', error);
          });
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO error:', err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [playRequested, isPlaying]);

  const handlePlay = () => {
    setPlayRequested(true); // Indicate play is requested
  };

  // Convert videoData to base64 and set as src if videoData is not null
  useEffect(() => {
    if (videoData && videoRef.current) {
      const base64String = btoa(String.fromCharCode(...videoData));
      videoRef.current.src = `data:image/jpeg;base64,${base64String}`;
    }
  }, [videoData]);

  return (
    <div className="KafkaVideo">
      <video ref={videoRef} controls onClick={handlePlay} />
    </div>
  );
};

export default KafkaVideo;
