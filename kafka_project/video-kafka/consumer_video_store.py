from confluent_kafka import Consumer, KafkaError

# Kafka consumer configuration
c = Consumer({
    'bootstrap.servers': 'enter_ip:9092',  # Replace with your Kafka broker address
    'group.id': 'video-consumer-group',        # Consumer group ID
    'auto.offset.reset': 'earliest'            # Start reading from the earliest offset
})

# Subscribe to the topic
c.subscribe(['topic_name'])

# File path to save the video data
file_path = '/home/user/Documents/nodedata.mp4'

try:
    # Open the file in append-binary mode
    with open(file_path, 'ab') as f:
        while True:
            msg = c.poll(1.0)  # Poll for messages with a 1-second timeout

            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    print(msg.error())
                    break

            # Write the video data to the file
            f.write(msg.value())
            # Print a message every time data is saved
            print(f"Data written to {file_path}")

except KeyboardInterrupt:
    print("Consumption interrupted.")
finally:
    # Close the consumer
    c.close()
    print(f"Video data saved to {file_path}")
