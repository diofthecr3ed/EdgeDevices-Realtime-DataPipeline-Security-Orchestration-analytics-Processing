import cv2
from kafka import KafkaConsumer
import numpy as np
import time

# Desired frame rate (e.g., 30 FPS)
desired_fps = 30
frame_interval = 1.0 / desired_fps

consumer = KafkaConsumer(
    'video_frames',
    bootstrap_servers=['10.1.16.103:9092'],
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    group_id='video-consumers'
)

start_time = time.time()
frame_count = 0

for message in consumer:
    frame_start_time = time.time()
    
    # Convert the message value to a numpy array and then to an image
    np_array = np.frombuffer(message.value, np.uint8)
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

cv2.destroyAllWindows()

