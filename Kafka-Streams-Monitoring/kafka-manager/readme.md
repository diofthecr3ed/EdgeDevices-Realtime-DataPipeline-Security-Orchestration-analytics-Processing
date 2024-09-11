# Kafka Manager Docker

This repository provides Docker images for Kafka Manager. Kafka Manager images come in two flavors:

- `stable`: Built from the latest Kafka Manager repository release.
- `latest`: Periodically assembled master builds. Not recommended for production use.

## Repository Transfer

**WARNING:** The repository ownership has been transferred. Please check the updated repository at [eshepelyuk/cmak-docker](https://github.com/eshepelyuk/cmak-docker/).

## Usage

### Using Docker

To run Kafka Manager with Docker, use the following command:

```bash
docker run -d \
     -p 9000:9000  \
     -e ZK_HOSTS="localhost:2181" \
     hlebalbau/kafka-manager:stable
