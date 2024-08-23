# EdgeDevices-Realtime-DataPipeline-Security-Orchestration-Analytics-Processing

##### Welcome to EdgeDevices-Realtime-DataPipeline-Security-Orchestration-Analytics-Processing, a comprehensive solution designed to manage and optimize data pipelines across edge devices, IoT, cloud environments, and microservices. This repository focuses on real-time data processing, robust security measures, orchestration, and analytics to provide a seamless and efficient data management experience


![Screenshot 2024-06-20 132127](https://github.com/guri2198/Smart-and-Sustainble-urban-Mobility-data-pipeline/assets/42201427/64255490-deb7-40e8-9790-579fd6f8d58e)


### Fast way to set up kafka cluster 

### 1. Download and Install Kafka

If you haven't installed Kafka yet, you can download it from the [Apache Kafka website](https://kafka.apache.org/downloads). Extract the tar file to your preferred directory.

```bash
tar -xzf kafka_2.13-2.8.0.tgz
cd kafka_2.13-2.8.0
```

### 2. Start Zookeeper

Kafka uses Zookeeper to manage distributed brokers. First, start Zookeeper.

```bash
bin/zookeeper-server-start.sh config/zookeeper.properties
```

### 3. Start Kafka Broker

In a new terminal window, navigate to your Kafka directory and start the Kafka broker.

```bash
bin/kafka-server-start.sh config/server.properties
```

### 4. Create a Kafka Topic (Optional)

If you want to create a new Kafka topic, you can use the following command. This step is optional as Kafka can create topics on demand.

```bash
bin/kafka-topics.sh --create --topic your_topic_name --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

### 5. Verify Kafka Topic (Optional)

To list the topics to ensure your topic has been created, you can run:

```bash
bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

### 6. Start Producing and Consuming Messages

You can start producing and consuming messages to verify that Kafka is working.

### 7. list all the kafka topics 

```bash
bin/kafka-topics.sh --list --bootstrap-server 169.254.3.1:9092
```
#### for mutiple brokers
```bash
bin/kafka-topics.sh --list --bootstrap-server 169.254.3.1:9092,169.254.3.1:9093,169.254.3.1:9094
```

#### 8. Delete the kafka topics Data along with topic name 
```
bin/kafka-topics.sh --bootstrap-server 169.254.3.1:9092 --delete --topic <TOPIC-NAME>
```
#### 9. lists Kafka topics and there Size in Giga-bytes
```
for topic in $(bin/kafka-topics.sh --list --bootstrap-server 172.18.0.1:9092); do
    echo "Topic: $topic";
    bin/kafka-log-dirs.sh --bootstrap-server 172.18.0.1:9092 --describe --topic-list $topic | grep -o '"size":[0-9]\+' | while read line; do
        size_in_bytes=$(echo $line | awk -F':' '{print $2}');
        if [[ ! -z "$size_in_bytes" && "$size_in_bytes" -ne 0 ]]; then
            size_in_gb=$(echo "scale=2; $size_in_bytes / 1024 / 1024 / 1024" | bc);
            echo "Partition Size: $size_in_gb GB";
        fi;
    done;
done
```

#### Start a Producer

In a new terminal window, start the producer:

```bash
bin/kafka-console-producer.sh --topic your_topic_name --bootstrap-server localhost:9092
```

#### Start a Consumer

In another terminal window, start the consumer:

```bash
bin/kafka-console-consumer.sh --topic your_topic_name --from-beginning --bootstrap-server localhost:9092
```

### Summary

- **Start Zookeeper:** `bin/zookeeper-server-start.sh config/zookeeper.properties`
- **Start Kafka Broker:** `bin/kafka-server-start.sh config/server.properties`
- **Create Kafka Topic:** (optional) `bin/kafka-topics.sh --create --topic your_topic_name --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1`
- **Verify Kafka Topic:** (optional) `bin/kafka-topics.sh --list --bootstrap-server localhost:9092`
- **Start Producer:** `bin/kafka-console-producer.sh --topic your_topic_name --bootstrap-server localhost:9092`
- **Start Consumer:** `bin/kafka-console-consumer.sh --topic your_topic_name --from-beginning --bootstrap-server localhost:9092`

### Required packages after kafka setup 
 #### Get java development kit 
        
         sudo apt-get update
         sudo apt-get install openjdk-21-jdk

  #### Get confluent kafka (if any error see error_readme_file)
  
         pip install confluent-kafka    
      

