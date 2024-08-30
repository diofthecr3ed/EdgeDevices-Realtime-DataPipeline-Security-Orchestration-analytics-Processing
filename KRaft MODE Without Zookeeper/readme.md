# Apache Kafka KRaft Mode

**KRaft (KRaft Raft) mode** allows Apache Kafka to operate **without ZooKeeper**, simplifying the architecture and offering several benefits:

### Benefits of KRaft Mode

- **Simplified Setup**: No need to manage a separate ZooKeeper cluster.
- **Improved Performance**: Direct metadata handling within Kafka enhances performance and scalability.
- **Easier Maintenance**: Fewer components to manage, reducing operational overhead.
- **Enhanced Reliability**: Integrated metadata management improves stability.

## How to Set Up KRaft Mode

### 1. Download Kafka

Get the latest Kafka release from the [Apache Kafka website](https://kafka.apache.org/downloads).

### 2. Generate a Cluster ID

Run the following command to generate a unique cluster ID:

```bash
~/kafka_2.13-3.0.0/bin/kafka-storage.sh random-uuid
```

This returns a UUID, for example 76BLQI7sT_ql1mBfKsOk9Q
Next, format your storage directory (replace <uuid> by your UUID obtained above)

```bash
kafka-storage.sh format -t <uuid> -c ~/kafka_2.13-3.0.0/config/kraft/server.properties
```

This will format the directory that is in the log.dirs in the config/kraft/server.properties file (by default /tmp/kraft-combined-logs)
Now you can launch the broker itself in daemon mode by running this command. 

```bash
kafka-server-start.sh ~/kafka_2.13-3.0.0/config/kraft/server.properties
```

# Enable KRaft mode
process.roles=broker,controller
node.id=1
metadata.log.dir=/path/to/metadata
log.dirs=/path/to/logs
