## Setting up MQTT with Kafka Connect Using Landoop

This guide helps you set up MQTT with Kafka Connect using Landoop's Fast Data Dev Docker image.

   - GET the MQTT Kafka Connect configuration file (`Mqtt-kafka-connect`) and the Docker Compose file (`docker-compose.yml`).
   - Place them in a directory of your choice.

2. **Start the Kafka Cluster:**
   - Navigate to the directory containing the Docker Compose file.
   - Start the Kafka cluster:
     ```bash
     docker-compose up -d
     ```

3. **Configure and Start the MQTT Connector:**
   - Customize the MQTT Kafka Connect configuration (`Mqtt-kafka-connect`) as needed for your MQTT broker setup.
   - Start the connector:
     ```bash
     curl -X POST -H "Content-Type: application/json" --data @Mqtt-kafka-connect http://localhost:8083/connectors
     ```

4. **Verify the Connector:**
   - Check the connector's status:
     ```bash
     curl -X GET http://localhost:8083/connectors/mqtt-source/status
     ```

5. **Send MQTT Messages:**
   - Start sending MQTT messages to your broker, which will be ingested into Kafka via the MQTT connector.

6. **Access Landoop UI:**
   - Monitor your Kafka cluster and connectors at http://localhost:3030.
   - You can also start the connector by placing the configuration file directly using the connector ui on Landoop UI
