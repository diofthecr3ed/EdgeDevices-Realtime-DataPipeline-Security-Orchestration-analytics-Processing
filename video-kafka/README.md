# Kafka Video Producer and Consumer

This project demonstrates how to set up a Kafka producer and consumer on different hosts to handle video files. The producer sends video content to a Kafka broker, and the consumer retrieves this content and saves it locally.

## Prerequisites

- Apache Kafka installed and running on a broker machine.
- Python 3.x installed on both the producer and consumer machines.
- `kafka-python` library installed on both machines.

## Kafka Broker Configuration

1. **Find the Kafka Broker IP Address:**

   On the machine where Kafka is running, find its IP address:

   ```bash
   # On Unix-based systems (Linux, macOS)
   ifconfig

   # or
   ip a

   # On Windows
   ipconfig
   ```

   Note the IP address of the network interface you will use to communicate with the Kafka broker.

2. **Edit Kafka Configuration:**

   Open the `server.properties` file in your Kafka config directory:

   ```bash
   nano /path/to/kafka/config/server.properties
   ```

3. **Update `listeners` and `advertised.listeners`:**

   Configure Kafka to listen on all network interfaces. Replace `your.kafka.server.ip` with your actual Kafka broker IP address:

   ```properties
   listeners=PLAINTEXT://0.0.0.0:9092
   advertised.listeners=PLAINTEXT://your.kafka.server.ip:9092
   ```

   Increase the maximum message size to handle large video files:

   ```properties
   message.max.bytes=104857600
   replica.fetch.max.bytes=104857600
   ```

4. **Restart Kafka:**

   Restart the Kafka broker to apply the changes:

   ```bash
   bin/kafka-server-stop.sh
   bin/kafka-server-start.sh config/server.properties
   ```

## Kafka Producer Configuration

Create a script named `kafka_producer_video.py` for the Kafka producer that will run on a remote machine to send video files.

### Kafka Producer Script

The producer script connects to the Kafka broker, reads a video file in chunks, and sends these chunks to the Kafka topic `video_content`.

### Running the Producer Script

Run the `kafka_producer_video.py` script on the remote host to send the video file to the Kafka broker.

## Kafka Consumer Configuration

Create a script named `kafka_consumer_video.py` for the Kafka consumer that will run on your local machine to receive and save video files.

### Kafka Consumer Script

The consumer script connects to the Kafka broker, consumes video chunks from the Kafka topic `video_content`, and writes these chunks to a local file named `received_video.mp4`.

### Running the Consumer Script

Run the `kafka_consumer_video.py` script on your local machine to consume the video chunks from the Kafka topic and save them to `received_video.mp4`.

## Summary

- **Kafka Broker Configuration:** Ensure the Kafka broker is configured to accept connections from both localhost and external IP addresses and can handle large messages.
- **Kafka Producer Configuration:** Set up producers to connect to Kafka either on localhost or the external IP address and send video files in chunks.
- **Run the Producer Scripts:** Execute the producer script on the external host to send video content to Kafka.
- **Consumer Setup:** Configure a Kafka consumer on your local machine to process the messages and save the video file locally.
