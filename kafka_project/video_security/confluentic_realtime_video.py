import cv2
from confluent_kafka import Producer
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

def send_video_frames(producer, topic, video_source=0, fps=30):
    cap = cv2.VideoCapture("http://labcam1.local:9081")
    if not cap.isOpened():
        logging.error("Error: Could not open video source.")
        return

    frame_interval = 1.0 / fps  # Time interval between frames
    start_time = time.time()
    frame_count = 0

    try:
        while True:
            frame_start_time = time.time()
            ret, frame = cap.read()
            if not ret:
                logging.warning("Warning: Failed to capture frame.")
                break

            _, buffer = cv2.imencode('.jpg', frame)
            producer.produce(topic, buffer.tobytes())
            logging.info("Frame sent to Kafka topic: %s", topic)

            frame_count += 1
            elapsed_time = time.time() - start_time
            if elapsed_time >= 1.0:  # Calculate FPS every second
                fps_actual = frame_count / elapsed_time
                logging.info("FPS: %.2f", fps_actual)
                start_time = time.time()  # Reset timer
                frame_count = 0  # Reset frame count

            frame_processing_time = time.time() - frame_start_time
            sleep_time = frame_interval - frame_processing_time
            if sleep_time > 0:
                time.sleep(sleep_time)
    except Exception as e:
        logging.error("Error: %s", e)
    finally:
        cap.release()
        logging.info("Video capture released.")

def create_producer(config):
    while True:
        try:
            producer = Producer(config)
            logging.info("Kafka producer created.")
            return producer
        except Exception as e:
            logging.error("Error creating Kafka producer: %s", e)
            time.sleep(5)  # Wait before retrying

if __name__ == "__main__":
    kafka_servers = '10.1.33.126:9092'
    topic = 'mytopic'

    config = {
        'bootstrap.servers': kafka_servers,
        'security.protocol': 'SASL_SSL',
        'sasl.mechanisms': 'SCRAM-SHA-512',  # Adjust according to your setup
        'sasl.username': 'dixonproducer',
        'sasl.password': 'Dixon@123',
        'ssl.ca.location': '/home/iot/kafka_2.13-3.7.1/kafka_security/ssl/ca-cert', 
        'ssl.endpoint.identification.algorithm': 'None'
    }

    while True:
        producer = create_producer(config)
        send_video_frames(producer, topic, fps=30)
        producer.flush()
        logging.info("Kafka producer closed. Restarting in 5 seconds...")
        time.sleep(5)  # Wait before retrying
