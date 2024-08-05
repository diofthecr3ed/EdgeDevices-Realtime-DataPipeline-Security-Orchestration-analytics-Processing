import cv2
from confluent_kafka import Consumer, KafkaException, KafkaError
import numpy as np
import time

# Desired frame rate (e.g., 30 FPS)
desired_fps = 30
frame_interval = 1.0 / desired_fps

kafka_servers = '10.1.33.126:9092'

conf = {
    'bootstrap.servers': kafka_servers,
    'group.id': 'video-consumers',
    'auto.offset.reset': 'earliest',
    'security.protocol': 'SASL_SSL',
    'sasl.mechanisms': 'SCRAM-SHA-512',  # Adjust according to your setup
    'sasl.username': 'dixonconsumer',
    'sasl.password': 'Dixon@123',
    'ssl.ca.location': '/home/iot/kafka_2.13-3.7.1/kafka_security/ssl/ca-cert',
    'ssl.endpoint.identification.algorithm': 'None'
}

consumer = Consumer(conf)

consumer.subscribe(['mytopic'])

start_time = time.time()
frame_count = 0

try:
    while True:
        msg = consumer.poll(timeout=1.0)
        
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(f"Error: {msg.error()}")
                break
        
        frame_start_time = time.time()
        
        # Convert the message value to a numpy array and then to an image
        np_array = np.frombuffer(msg.value(), np.uint8)
        frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        
        # Display the frame
        cv2.imshow('Received Video', frame)
        
        # Calculate FPS
        frame_count += 1
        elapsed_time = time.time() - start_time
        if elapsed_time >= 1.0:  # Calculate FPS every second
            fps_actual = frame_count / elapsed_time
            print(f"FPS: {fps_actual:.2f}")
            start_time = time.time()  # Reset timer
            frame_count = 0  # Reset frame count
        
        # Handle exit condition
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        # Adjust the sleep time to maintain the desired frame rate
        frame_processing_time = time.time() - frame_start_time
        sleep_time = frame_interval - frame_processing_time
        if sleep_time > 0:
            time.sleep(sleep_time)
finally:
    consumer.close()
    cv2.destroyAllWindows()
