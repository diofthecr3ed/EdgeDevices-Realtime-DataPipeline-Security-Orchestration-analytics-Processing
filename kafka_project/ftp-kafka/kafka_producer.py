from kafka import KafkaProducer

def send_file(producer, topic, file_path):
    with open(file_path, 'rb') as file:
        content = file.read()
        producer.send(topic, content)

if __name__ == "__main__":
    # Use the IP address of your Kafka broker
    producer = KafkaProducer(bootstrap_servers='10.1.33.25:9092')

    # Define file path
    file_path = 'file.txt'

    # Send file content
    send_file(producer, 'file_content', file_path)
    producer.flush()
    producer.close()
