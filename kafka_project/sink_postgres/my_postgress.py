from kafka import KafkaConsumer
import psycopg2
from psycopg2.extras import execute_values
from uuid import uuid4
import json
import logging
from tenacity import retry, stop_after_attempt, wait_fixed

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Kafka consumer configuration
bootstrap_servers = '10.1.33.165:9092'  # Replace with your actual Kafka bootstrap server address
group_id = 'postgres'
auto_offset_reset = 'earliest'
kafka_topic = "mqtt-data"

# Retry settings
retry_attempts = 5
retry_wait = 5

# PostgreSQL connection configuration
postgres_config = {
    'dbname': 'mydatabase',  # Replace with your database name
    'user': 'myuser',        # Replace with your database user
    'password': 'mypassword',# Replace with your database password
    'host': 'localhost',     # Replace with your PostgreSQL server address
    'port': '5432'           # Replace with your PostgreSQL server port
}

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
def create_postgres_connection():
    conn = psycopg2.connect(**postgres_config)
    conn.autocommit = True
    return conn, conn.cursor()


def process_message(cursor, query, kafka_message):
    try:
        # Process the Kafka message
        id = uuid4()
        postgres_record = {
            'id': str(id),
            'cpu_temperature': kafka_message.get('cpu_temperature'),
            'ram_usage_percent': kafka_message.get('ram_usage_percent')
        }

        # Log the received message
        logger.info(f"Received message: {kafka_message}")

        # Insert the data into PostgreSQL
        cursor.execute(query, (postgres_record['id'], postgres_record['cpu_temperature'], postgres_record['ram_usage_percent']))
        logger.info(f"Inserted record: {postgres_record}")

    except Exception as e:
        logger.error(f"Error processing message: {e}")
        raise e


@retry(stop=stop_after_attempt(retry_attempts), wait=wait_fixed(retry_wait))
def consume_messages(consumer, cursor, query):
    for message in consumer:
        kafka_message = message.value.get("payload")
        process_message(cursor, query, kafka_message)


def main():
    # Create Kafka consumer
    consumer = create_kafka_consumer()
    logger.info("Connected to Kafka broker successfully.")

    # Create PostgreSQL connection
    conn, cursor = create_postgres_connection()
    logger.info("Connected to PostgreSQL database successfully.")

    try:
        # Prepare PostgreSQL insert query
        query = "INSERT INTO my_table (id, cpu_temperature, ram_usage_percent) VALUES (%s, %s, %s)"

        while True:
            try:
                consume_messages(consumer, cursor, query)
            except Exception as e:
                logger.error(f"Error during message consumption: {e}")

    except Exception as e:
        logger.error(f"Error in main execution: {e}")

    finally:
        try:
            consumer.close()
            cursor.close()
            conn.close()
        except Exception as e:
            logger.error(f"Error closing resources: {e}")


if __name__ == "__main__":
    main()
