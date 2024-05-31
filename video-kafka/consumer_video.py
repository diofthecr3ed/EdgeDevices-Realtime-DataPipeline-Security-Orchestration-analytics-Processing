from kafka import KafkaConsumer
import os

# Kafka Consumer Configuration
consumer = KafkaConsumer(
    'video_content',
    bootstrap_servers=['10.1.33.25:9092'],
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    group_id='my-group'
)

# Define the path to save the video file
output_file_path = 'received_video.mp4'

# Reassemble video chunks and save to file
with open(output_file_path, 'wb') as video_file:
    for message in consumer:
        video_file.write(message.value)

print(f"Video saved to {output_file_path}")
