# Kafka to Cassandra Data Pipeline

This project consists of a Python script that consumes messages from a Kafka topic and inserts the data into a Cassandra database. The script uses the `kafka-python` library to interact with Kafka and the `cassandra-driver` library to interact with Cassandra. It also utilizes the `tenacity` library for retry mechanisms in case of failures.

## Prerequisites

Before running this script, ensure you have the following installed:

- Python 3.7+
- Kafka
- Cassandra
- `kafka-python` library
- `cassandra-driver` library
- `tenacity` library

## Installation

1. Clone this repository to your local machine.
2. Install the required Python packages using pip:

   ```bash
   pip install kafka-python cassandra-driver tenacity
   ```

## Configuration

### Kafka Configuration

Update the `bootstrap_servers` and `kafka_topic` variables in the script with your Kafka server details and the topic you want to consume from.

### Cassandra Configuration

Update the Cassandra cluster connection details in the `create_cassandra_session` function. Ensure the keyspace and table names match your Cassandra schema.

```python
# Kafka consumer configuration
bootstrap_servers = '10.1.17.100:9092'  # Replace with your actual Kafka bootstrap server address
group_id = 'cassandra'
auto_offset_reset = 'earliest'
kafka_topic = "mqtt-data"

# Cassandra connection
cluster = Cluster(['127.0.0.1'])  # Replace with your actual Cassandra cluster address
```

### Cassandra Schema

Ensure you have a Cassandra keyspace and table created as follows:

```cql
CREATE KEYSPACE my_keyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

USE my_keyspace;

CREATE TABLE my_table (
    id UUID PRIMARY KEY,
    cpu_temperature float,
    ram_usage_percent float
);
```

## Running the Script

Run the script using Python:

```bash
python your_script_name.py
```

## Script Overview

- **Logging Configuration**: The script uses Python's logging library to log information and errors.
- **Retry Mechanism**: The script uses the `tenacity` library to retry creating Kafka consumer and Cassandra session upon failure.
- **Kafka Consumer**: The consumer reads messages from the specified Kafka topic.
- **Cassandra Session**: The script connects to the Cassandra cluster and prepares an insert query.
- **Message Processing**: The script processes each message from Kafka, extracts relevant fields, and inserts them into Cassandra.
- **Graceful Shutdown**: The script handles closing the Kafka consumer and Cassandra cluster connection gracefully.

## Error Handling

The script includes error handling and retry mechanisms to ensure robust operation. It logs any errors encountered during message processing and retries operations as configured.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [kafka-python](https://github.com/dpkp/kafka-python)
- [cassandra-driver](https://github.com/datastax/python-driver)
- [tenacity](https://github.com/jd/tenacity)
```

### Additional Notes

- Replace `your_script_name.py` with the actual name of your Python script file.
- Ensure your Kafka and Cassandra services are running and accessible from the machine where you run the script.
- You can customize the retry settings (`retry_attempts` and `retry_wait`) according to your requirements.
