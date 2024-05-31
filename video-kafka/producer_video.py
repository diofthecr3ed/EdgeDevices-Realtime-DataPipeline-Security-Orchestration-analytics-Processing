from kafka import KafkaProducer

def send_video(producer, topic, file_path):
    chunk_size = 1024 * 1024  # 1 MB
    with open(file_path, 'rb') as file:
        while chunk := file.read(chunk_size):
            producer.send(topic, chunk)

if __name__ == "__main__":
    # Connect to Kafka broker on the external IP address
    producer = KafkaProducer(bootstrap_servers='10.1.33.25:9092')

    # Define file path
    file_path = 'video.mp4'

    # Send video content in chunks
    send_video(producer, 'video_content', file_path)
    producer.flush()
    producer.close()
