from flask import Flask, render_template, request
from flask_socketio import SocketIO
from threading import Lock
import psycopg2
import logging

# Enable logging
logging.basicConfig(level=logging.DEBUG)

# Database connection settings
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'postgres'
DB_USER = 'postgres'
DB_PASSWORD = 'password'

def fetch_vehicle_data():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        cursor.execute("SELECT type, COUNT(*) FROM vehicles GROUP BY type")
        records = cursor.fetchall()
        cursor.close()
        conn.close()
        return records
    except Exception as e:
        logging.error("Error fetching vehicle data from database: %s", e)
        return []

def fetch_table_data():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        cursor.execute("SELECT number_plate, vehicle_type, violation_type FROM violations")
        records = cursor.fetchall()
        cursor.close()
        conn.close()
        return records
    except Exception as e:
        logging.error("Error fetching table data from database: %s", e)
        return []

app = Flask(__name__)
app.config['SECRET_KEY'] = 'aadi'
socketio = SocketIO(app, cors_allowed_origins='*')

thread = None
thread_lock = Lock()

def background_thread():
    while True:
        socketio.sleep(10)
        vehicle_data = fetch_vehicle_data()
        logging.debug("Emitting vehicle data: %s", vehicle_data)
        socketio.emit('updateVehicleData', vehicle_data)
        
        table_data = fetch_table_data()
        logging.debug("Emitting table data: %s", table_data)
        socketio.emit('updateTableData', table_data)

@socketio.on('connect')
def connect():
    global thread
    logging.info('Client connected: %s', request.sid)

    with thread_lock:
        if thread is None:
            logging.info("Starting background thread")
            thread = socketio.start_background_task(background_thread)

@socketio.on('disconnect')
def disconnect():
    logging.info('Client disconnected: %s', request.sid)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    logging.info("Starting Flask app")
    socketio.run(app, debug=True)
