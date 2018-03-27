docker stop sqrd_lookupsbot
docker rm sqrd_lookupsbot
docker run -itd --name=sqrd_lookupsbot sqrd/lookupsbot
