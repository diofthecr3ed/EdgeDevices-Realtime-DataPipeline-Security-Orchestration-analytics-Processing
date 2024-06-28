from kafka import KafkaConsumer
from ftplib import FTP
import os

# Kafka Consumer Configuration
consumer = KafkaConsumer(
    'file_content',
    bootstrap_servers=['10.1.33.25:9092'],
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    group_id='my-group'
)

# FTP Configuration
ftp_server = 'ftp.server.ip'
ftp_user = 'ftpuser'
ftp_password = 'ftppassword'
remote_path = '/path/on/ftp/server'

def transfer_file_via_ftp(file_content, ftp_server, ftp_user, ftp_password, remote_path, file_name):
    ftp = FTP(ftp_server)
    ftp.login(user=ftp_user, passwd=ftp_password)
    with open(file_name, 'wb') as file:
        file.write(file_content)
    with open(file_name, 'rb') as file:
        ftp.storbinary(f'STOR {remote_path}/{file_name}', file)
    ftp.quit()
    os.remove(file_name)

# Consume messages and transfer to FTP
for message in consumer:
    file_content = message.value
    file_name = f"{message.topic}-{message.partition}-{message.offset}.txt"
    transfer_file_via_ftp(file_content, ftp_server, ftp_user, ftp_password, remote_path, file_name)
