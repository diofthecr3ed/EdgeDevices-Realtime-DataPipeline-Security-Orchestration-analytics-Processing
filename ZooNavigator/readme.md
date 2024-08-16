
# ZooNavigator

ZooNavigator is a web-based **ZooKeeper UI and editor/browser** with many features.


ZooKeeper versions 3.4.x and 3.5.x are currently supported.


[**📘 Read official docs for more info, screenshots 📷 and instructions how to use ZooNavigator. 🔥**](https://zoonavigator.elkozmon.com)

## Quick start

You can run ZooNavigator from:

- [Docker](#docker)
- [Snap](#snap)

### Docker

Start Docker container:

```
docker run \
  -d \
  -p 9000:9000 \
  -e HTTP_PORT=9000 \
  --name zoonavigator \
  --restart unless-stopped \
  elkozmon/zoonavigator:latest
```

Go to [http://localhost:9000](http://localhost:9000).

**Note:**

If wanting to access ZooKeeper running locally on host machine (not in Docker container): 

 - Linux users may use `--net host` instead of exposing the port
 - Windows and Mac users should [follow this advice](https://github.com/elkozmon/zoonavigator/issues/40#issue-495910852)

### Snap

Install ZooNavigator from [Snap store](https://snapcraft.io/zoonavigator):

```
sudo snap install zoonavigator
```

Go to http://localhost:9000.


