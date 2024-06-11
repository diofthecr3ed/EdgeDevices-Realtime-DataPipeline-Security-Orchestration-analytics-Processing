import cv2
from kafka import KafkaProducer
import time

def send_video_frames(producer, topic, video_source=0):
    cap = cv2.VideoCapture(video_source)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        _, buffer = cv2.imencode('.jpg', frame)
        producer.send(topic, buffer.tobytes())
        # Simulate real-time by waiting for a short period
        time.sleep(0.04)  # Adjust the sleep time based on your video's frame rate
    cap.release()

if __name__ == "__main__":
    producer = KafkaProducer(bootstrap_servers='10.1.33.25:9092')
    send_video_frames(producer, 'video_frames')
    producer.flush()
    producer.close()
