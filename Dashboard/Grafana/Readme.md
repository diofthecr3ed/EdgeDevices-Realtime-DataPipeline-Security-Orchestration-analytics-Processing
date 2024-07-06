

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

Change between the data_generator 1 and 2 files in dockerfile based on whichever page is running, 1-iot metrics, 2-lab metrics. Replace 2 with 1 here based on requirement: 
```
COPY ./scripts/data_generator2.py /scripts/data_generator2.py
CMD ["python", "/scripts/data_generator2.py"]
```

To stop:
```
docker-compose down
```

