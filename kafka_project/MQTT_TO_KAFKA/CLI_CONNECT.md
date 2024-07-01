# Kafka Connect with MQTT Source Connector Setup Guide

This guide provides step-by-step instructions to set up and configure Kafka Connect with an MQTT source connector.

## Prerequisites

- Kafka and Kafka Connect installed.
- MQTT broker installed and running.
- Required plugins for Kafka Connect installed.
- `curl` installed for HTTP requests.

## Step 1: Install Kafka and Kafka Connect

Download and extract Kafka from the official [Kafka website](https://kafka.apache.org/downloads).

```bash
wget https://downloads.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz
tar -xzf kafka_2.13-3.7.0.tgz
cd kafka_2.13-3.7.0
```

## Step 2: Start Kafka and Zookeeper

Kafka requires Zookeeper to be running. Start Zookeeper and Kafka.

```bash
# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# In a new terminal, start Kafka
bin/kafka-server-start.sh config/server.properties
```

## Step 3: Configure Kafka Connect

Create a Kafka Connect properties file (`connect-standalone.properties`):

```properties
bootstrap.servers=10.1.16.103:9092
group.id=connect-cluster

key.converter=org.apache.kafka.connect.json.JsonConverter
value.converter=org.apache.kafka.connect.json.JsonConverter
key.converter.schemas.enable=true
value.converter.schemas.enable=true

offset.storage.topic=connect-offsets
offset.storage.replication.factor=1

config.storage.topic=connect-configs
config.storage.replication.factor=1

status.storage.topic=connect-status
status.storage.replication.factor=1

offset.flush.interval.ms=10000

rest.port=8083

plugin.path=/path/to/your/plugins
```

Ensure the `plugin.path` points to the directory containing the MQTT connector plugin.

## Step 4: Start Kafka Connect

Start Kafka Connect with the configuration file.

```bash
bin/connect-standalone.sh config/connect-standalone.properties
```

## Step 5: Configure MQTT Source Connector

Create a JSON configuration file (`mqtt-connector-config.json`) for the MQTT source connector:

```json
{
  "name": "source-mqtt",
  "config": {
    "connector.class": "io.confluent.connect.mqtt.MqttSourceConnector",
    "tasks.max": "1",
    "mqtt.server.uri": "tcp://127.0.0.1:1881",
    "mqtt.topics": "sensors/cpu_ram",
    "kafka.topic": "mqtt-data",
    "mqtt.qos": "2",
    "confluent.topic.bootstrap.servers": "10.1.16.103:9092",
    "confluent.topic.replication.factor": "1"
  }
}
```

## Step 6: Deploy the Connector

Use `curl` to deploy the connector configuration:

```bash
curl -X POST -H "Content-Type: application/json" --data @mqtt-connector-config.json http://localhost:8083/connectors
```

## Step 7: Verify the Connector

Check the status of the connector:

```bash
curl -X GET http://localhost:8083/connectors/source-mqtt/status
```

## Step 8: Update or Stop the Connector

To update the connector configuration, use the following command:

```bash
curl -X PUT -H "Content-Type: application/json" --data @mqtt-connector-config.json http://localhost:8083/connectors/source-mqtt/config
```

To stop the connector:

```bash
curl -X DELETE http://localhost:8083/connectors/source-mqtt
```

## Conclusion

Following these steps, you should have a fully functional Kafka Connect instance with an MQTT source connector. Ensure all services are running, and configurations are correctly set for smooth operation.

For further customization, refer to the official documentation of Kafka Connect and the MQTT connector.

---

Save this as `README.md` in your project directory.
