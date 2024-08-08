import cv2
from confluent_kafka import Producer
import time
import logging
import signal
import sys

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

def signal_handler(sig, frame):
    logging.info('Signal received, exiting...')
    sys.exit(0)

def delivery_report(err, msg):
    if err is not None:
        logging.error("Delivery failed: %s", err)
    else:
        logging.info("Message delivered to %s [%d] at offset %d", msg.topic(), msg.partition(), msg.offset())

def send_video_frames(producer, topic, video_source="labcam1.local:9081", fps=30):
    cap = cv2.VideoCapture(video_source)
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

            # Encode the frame as JPEG
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            # Produce the frame to Kafka topic
            producer.produce(topic, value=frame_bytes, callback=delivery_report)
            producer.poll(0)  # Serve delivery reports

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

def create_producer(kafka_servers):
    while True:
        try:
            conf = {
                'bootstrap.servers': kafka_servers,
            }
            producer = Producer(conf)
            logging.info("Kafka producer created.")
            return producer
        except Exception as e:
            logging.error("Error creating Kafka producer: %s", e)
            time.sleep(5)  # Wait before retrying

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)

    kafka_servers = '10.1.33.90:9092'
    topic = 'video_frames'

    while True:
        producer = create_producer(kafka_servers)
        send_video_frames(producer, topic, video_source="http://labcam1.local:9081/", fps=30)
        producer.flush()  # Ensure all messages are sent
        logging.info("Kafka producer flushed. Restarting in 5 seconds...")
        time.sleep(5)  # Wait before retrying





