  GNU nano 5.4                                                                                                                                                                                                                                                                                                         producer_live_6.py                                                                                                                                                                                                                                                                                                                  
import cv2
from kafka import KafkaProducer
import time
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

def send_video_frames(producer, topic, video_source=1, fps=30):
    cap = cv2.VideoCapture(video_source)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)  # Reduced resolution
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)
    cap.set(cv2.CAP_PROP_FPS, fps)  # Set camera FPS

    if not cap.isOpened():
        logging.error("Error: Could not open video source.")
        return

    frame_interval = 1.0 / fps
    start_time = time.time()
    frame_count = 0

    try:
        while True:
            frame_start_time = time.time()
            ret, frame = cap.read()
            if not ret:
                logging.warning("Warning: Failed to capture frame.")
                break

            # Compress frame with higher compression for performance
            _, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 50])
            producer.send(topic, buffer.tobytes())
            frame_count += 1

            # Get current timestamp
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Ensure consistent frame rate by sleeping if necessary
            frame_processing_time = time.time() - frame_start_time
            sleep_time = frame_interval - frame_processing_time
            if sleep_time > 0:
                time.sleep(sleep_time)

            # Calculate and log FPS every second
            elapsed_time = time.time() - start_time
            if elapsed_time >= 1.0:  # Only calculate FPS every second
                fps_actual = frame_count / elapsed_time
                logging.info("Frame: %d, Topic: %s, Timestamp: %s, FPS: %.2f",
                             frame_count, topic, current_time, fps_actual)
                # Reset frame count and start time after logging FPS
                frame_count = 0
                start_time = time.time()
    except Exception as e:
        logging.error("Error: %s", e)
    finally:
        cap.release()
        logging.info("Video capture released.")

def create_producer(kafka_servers):
    while True:
        try:
            producer = KafkaProducer(
                bootstrap_servers=kafka_servers,
                linger_ms=5,
                batch_size=32 * 1024,
                acks=0,
                max_in_flight_requests_per_connection=5
            )
            logging.info("Kafka producer created.")
            return producer
        except Exception as e:
            logging.error("Error creating Kafka producer: %s", e)
            time.sleep(5)

if __name__ == "__main__":
    kafka_servers = '10.1.56.46:9092'
    topic = 'Gatenodeframes'

    while True:
        producer = create_producer(kafka_servers)
        send_video_frames(producer, topic, fps=30)
        producer.flush()
        producer.close()
        logging.info("Kafka producer closed. Restarting in 5 seconds...")
        time.sleep(5)

