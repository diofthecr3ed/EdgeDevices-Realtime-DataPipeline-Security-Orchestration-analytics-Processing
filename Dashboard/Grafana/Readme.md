

# Running the Containers

In root directory:

```
docker-compose build
docker-compose up -d
docker-compose ps (to check if all 3 containers are running)
```

Grafana Server will be running on port 3000.  
InfluxDB port will be running on port 8086.

For both portals,

username = admin  
pass = admin_password

and INFLUXDB_ORG=my-org

Token found in docker compose file is generated via influxdb token portal. 

To stop:
```
docker-compose down
```

