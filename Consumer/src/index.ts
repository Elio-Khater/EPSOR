const startServer = async () => {
  const Kafka = require("node-rdkafka");
  const { insert } = require("./mongo-helper");
  var stream = Kafka.KafkaConsumer.createReadStream(
    {
      "metadata.broker.list": "localhost:9092",
      "group.id": "librd-test",
      "socket.keepalive.enable": true,
      "enable.auto.commit": false,
    },
    {},
    {
      topics: ["products"],
      waitInterval: 0,
      objectMode: false,
    }
  );

  stream.on("error", function (err: any) {
    if (err) console.log(err);
    process.exit(1);
  });

  stream.on("error", function (err: any) {
    console.log(err);
    process.exit(1);
  });

  stream.on("data", function (message: any) {
    console.log("Got message");
    console.log(message.toString());
    let inserted = insert(JSON.parse(message.toString()));
    if (!inserted) {
      console.log("did not insert the message");
    } else {
      console.log("insert success");
    }
  });

  stream.consumer.on("event.error", function (err: any) {
    console.log(err);
  });
};
startServer();
