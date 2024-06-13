from flask import Flask, render_template, request
from flask_socketio import SocketIO
from threading import Lock
from datetime import datetime
import time
import csv

# Path to the CSV file
CSV_FILE_PATH = 'sensor_data.csv'

# Function to read data from the CSV file
def read_csv_data(file_path):
    data = []
    with open(file_path, mode='r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            # Convert necessary fields to their appropriate data types
            row['temperature'] = float(row['temperature'])
            row['humidity'] = float(row['humidity'])
            row['cpu_temperature'] = float(row['cpu_temperature'])
            row['ram_usage'] = float(row['ram_usage'])
            row['network_data_sent'] = int(row['network_data_sent'])
            row['network_data_received'] = int(row['network_data_received'])
            data.append(row)
    return data

# Load the data from CSV
data = read_csv_data(CSV_FILE_PATH)

thread = None
thread_lock = Lock()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'aadi'
socketio = SocketIO(app, cors_allowed_origins='*')

def background_thread():
    print("Sending real sensor values")
    for record in data:
        timestamp = record['timestamp']
        cpu_temperature = record['cpu_temperature']
        ram_usage = record['ram_usage']
        humidity = record['humidity']
        socketio.emit('updateSensorData', {'timestamp': timestamp, 'cpu_temperature': cpu_temperature, 'ram_usage': ram_usage, 'humidity': humidity})
        time.sleep(1)  # Simulate the 0.5-second interval between data points

@socketio.on('connect')
def connect():
    global thread
    print('Client connected')

    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected', request.sid)

if __name__ == '__main__':
    socketio.run(app)
