from flask import Flask, render_template, request
from flask_socketio import SocketIO
from threading import Lock
from datetime import datetime
import time
import psycopg2
import logging

# Enable logging
logging.basicConfig(level=logging.DEBUG)

# Database connection settings
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'postgres'
DB_USER = 'postgres'
DB_PASSWORD = '<password goes here>'

def fetch_data_from_db():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        cursor.execute("""
            SELECT timestamp, temperature, humidity, cpu_temperature, ram_usage, network_data_sent, network_data_received 
            FROM data
        """)
        records = cursor.fetchall()
        cursor.close()
        conn.close()
        return records
    except Exception as e:
        logging.error("Error fetching data from database: %s", e)
        return []

data = fetch_data_from_db()
logging.debug("Data fetched from DB: %s", data)

thread = None
thread_lock = Lock()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'aadi'
socketio = SocketIO(app, cors_allowed_origins='*')

def background_thread():
    logging.info("Background thread started")
    for record in data:
        timestamp, temperature, humidity, cpu_temperature, ram_usage, network_data_sent, network_data_received = record
        logging.debug("Emitting data: %s", record)
        # Convert timestamp to string
        timestamp_str = timestamp.strftime('%Y-%m-%d %H:%M:%S')
        socketio.emit('updateSensorData', {
            'timestamp': timestamp_str,
            'cpu_temperature': cpu_temperature,
            'ram_usage': ram_usage,
            'humidity': humidity
        })
        time.sleep(1)  # Simulate the 1-second interval between data points

@socketio.on('connect')
def connect():
    global thread
    logging.info('Client connected')

    with thread_lock:
        if thread is None:
            logging.info("Starting background thread")
            thread = socketio.start_background_task(background_thread)

@socketio.on('disconnect')
def disconnect():
    logging.info('Client disconnected: %s', request.sid)

if __name__ == '__main__':
    logging.info("Starting Flask app")
    socketio.run(app)
