import cv2
from kafka import KafkaConsumer
import numpy as np

consumer = KafkaConsumer(
    'video_frames',
    bootstrap_servers=['10.1.33.25:9092'],
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    group_id='video-consumers'
)

for message in consumer:
    np_array = np.frombuffer(message.value, np.uint8)
    frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    cv2.imshow('Received Video', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cv2.destroyAllWindows()
