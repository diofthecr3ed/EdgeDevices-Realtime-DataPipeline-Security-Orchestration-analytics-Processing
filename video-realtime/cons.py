import cv2
from kafka import KafkaConsumer
import numpy as np

# Kafka consumer setup
topic = 'video_frames'
bootstrap_servers = '10.1.16.103:9092'

consumer = KafkaConsumer(
    topic,
    bootstrap_servers=bootstrap_servers,
    auto_offset_reset='latest',
    enable_auto_commit=True,
    group_id='video-consumers',
    value_deserializer=lambda x: np.frombuffer(x, dtype=np.uint8)
)

for message in consumer:
    print(message)
    frame = message.value

    # Decode the frame
    frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)

    # Check if the frame is valid
    if frame is None or frame.size == 0:
        print("Received an empty frame")
        continue

    # Display the frame
    cv2.imshow('Received Video', frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cv2.destroyAllWindows()

