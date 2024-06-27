from kafka import KafkaConsumer
from cassandra.cluster import Cluster
from uuid import uuid4
import json
import logging
from tenacity import retry, stop_after_attempt, wait_fixed

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Kafka consumer configuration
bootstrap_servers = '10.1.17.100:9092'  # Replace with your actual Kafka bootstrap server address
group_id = 'cassandra'
auto_offset_reset = 'earliest'
kafka_topic = "mqtt-data"

# Retry settings
retry_attempts = 5
retry_wait = 5


@retry(stop=stop_after_attempt(retry_attempts), wait=wait_fixed(retry_wait))
def create_kafka_consumer():
    return KafkaConsumer(
        kafka_topic,
        bootstrap_servers=bootstrap_servers,
        group_id=group_id,
        auto_offset_reset=auto_offset_reset,
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )


@retry(stop=stop_after_attempt(retry_attempts), wait=wait_fixed(retry_wait))
def create_cassandra_session():
    cluster = Cluster(['127.0.0.1'])  
    return cluster, cluster.connect('my_keyspace')


def process_message(session, query, kafka_message):
    try:
        # Process the Kafka message
        # kafka_message = message.value.get("payload")
        id = uuid4()
        cassandra_record = {
            'id': id,
            'cpu_temperature': kafka_message.get('cpu_temperature'),
            'ram_usage_percent': kafka_message.get('ram_usage_percent')
        }

        # Log the received message
        logger.info(f"Received message: {kafka_message}")

        # Insert the data into Cassandra
        session.execute(query, (cassandra_record['id'], cassandra_record['cpu_temperature'], cassandra_record['ram_usage_percent']))
        logger.info(f"Inserted record: {cassandra_record}")

    except Exception as e:
        logger.error(f"Error processing message: {e}")
        raise e


@retry(stop=stop_after_attempt(retry_attempts), wait=wait_fixed(retry_wait))
def consume_messages(consumer, session, query):
    for message in consumer:
        kafka_message = message.value.get("payload")
        process_message(session, query, kafka_message)

def main():
    # Create Kafka consumer
    consumer = create_kafka_consumer()
    logger.info("Connected to Kafka broker successfully.")

    # Create Cassandra session
    cluster, session  = create_cassandra_session()
    logger.info("Connected to Cassandra cluster successfully.")

    try:

        # Prepare Cassandra insert query
        query = session.prepare("INSERT INTO my_table (id, cpu_temperature, ram_usage_percent) VALUES (?, ?, ?)")

        while True:
            try:
                consume_messages(consumer, session, query)
            except Exception as e:
                logger.error(f"Error during message consumption: {e}")

    except Exception as e:
        logger.error(f"Error in main execution: {e}")

    finally:
        try:
            consumer.close()
            cluster.shutdown()
        except Exception as e:
            logger.error(f"Error closing resources: {e}")

if __name__ == "__main__":
    main()
