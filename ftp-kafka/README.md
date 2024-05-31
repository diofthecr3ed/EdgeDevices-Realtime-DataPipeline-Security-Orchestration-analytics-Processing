# Kafka Producer and Consumer with FTP Transfer

This project demonstrates how to set up a Kafka producer and consumer on different hosts. The producer sends file content to a Kafka broker, and the consumer retrieves this content and transfers it via FTP to a specified server.

## Prerequisites

- Apache Kafka installed and running on a broker machine.
- Python 3.x installed on both the producer and consumer machines.
- `kafka-python` library installed on both machines.
- `ftplib` library for FTP transfer in Python.
- FTP server set up and configured.

## Kafka Broker Configuration

1. **Find the Kafka Broker IP Address:**

   On the machine where Kafka is running, find its IP address:

   ```bash
   # On Unix-based systems (Linux, macOS)
   ifconfig

   # or
   ip a

   # On Windows
   ipconfig
   ```

   Note the IP address of the network interface you will use to communicate with the Kafka broker.

2. **Edit Kafka Configuration:**

   Open the `server.properties` file in your Kafka config directory:

   ```bash
   nano /path/to/kafka/config/server.properties
   ```

3. **Update `listeners` and `advertised.listeners`:**

   Configure Kafka to listen on the external IP address. Replace `your.kafka.server.ip` with your actual Kafka broker IP address:

   ```properties
   listeners=PLAINTEXT://10.1.33.25:9092
   advertised.listeners=PLAINTEXT://10.1.33.25:9092
   ```

4. **Restart Kafka:**

   Restart the Kafka broker to apply the changes:

   ```bash
   bin/kafka-server-stop.sh
   bin/kafka-server-start.sh config/server.properties
   ```

## FTP Server Setup

### Install vsftpd (Very Secure FTP Daemon)

1. **Install vsftpd:**

   On your FTP server machine, install `vsftpd`:

   ```bash
   sudo apt update
   sudo apt install vsftpd
   ```

2. **Backup Configuration File:**

   Backup the original configuration file:

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.bak
   ```

3. **Edit Configuration File:**

   Open the configuration file for editing:

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

4. **Configure vsftpd:**

   Update the configuration to allow local users, enable write access, and set the chroot list. Add or uncomment the following lines:

   ```properties
   anonymous_enable=NO
   local_enable=YES
   write_enable=YES
   chroot_local_user=YES
   allow_writeable_chroot=YES
   ```

5. **Create FTP User:**

   Create a new user for FTP access and set a password:

   ```bash
   sudo adduser ftpuser
   sudo passwd ftpuser
   ```

6. **Set Directory Permissions:**

   Set appropriate permissions for the FTP directory:

   ```bash
   sudo mkdir -p /home/ftpuser/ftp
   sudo chown nobody:nogroup /home/ftpuser/ftp
   sudo chmod a-w /home/ftpuser/ftp

   sudo mkdir -p /home/ftpuser/ftp/files
   sudo chown ftpuser:ftpuser /home/ftpuser/ftp/files
   ```

7. **Restart vsftpd:**

   Restart the vsftpd service to apply the changes:

   ```bash
   sudo systemctl restart vsftpd
   ```

8. **Allow vsftpd through the firewall:**

   If you have a firewall enabled, allow vsftpd through the firewall:

   ```bash
   sudo ufw allow 20/tcp
   sudo ufw allow 21/tcp
   sudo ufw allow 40000:50000/tcp
   sudo ufw reload
   ```

### Verify FTP Server

1. **Connect to the FTP Server:**

   Use an FTP client or command line to connect to the FTP server:

   ```bash
   ftp your.ftp.server.ip
   ```

2. **Login with FTP User:**

   Login using the `ftpuser` credentials you created:

   ```bash
   Name (your.ftp.server.ip:yourusername): ftpuser
   Password: <enter your password>
   ```

   You should be able to upload and download files from the `/home/ftpuser/ftp/files` directory.

## Summary

- **Kafka Broker Configuration:** Ensure the Kafka broker is configured to accept connections from external IP addresses.
- **Kafka Producer Configuration:** Configure the producer on the remote host to connect to the Kafka broker using its IP address.
- **FTP Server Setup:** Set up an FTP server to allow file transfers.
- **Run the Producer Script:** Execute the producer script on the remote host to send file content to Kafka.
- **Consumer Setup:** Configure a Kafka consumer on another host to process and transfer the messages via FTP.
