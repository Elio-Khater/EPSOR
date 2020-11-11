const startServer = async () => {
  var Kafka = require("node-rdkafka");
  const { MongoClient } = require("mongodb");
  const uri =
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
  const client = new MongoClient(uri);
  const insert = async function (document: any) {
    try {
      await client.connect();
      const database = client.db("epsor");
      const collection = database.collection("product");
      const result = await collection.insertOne(document);
      console.log(result.insertedCount);
    } finally {
      await client.close();
    }
  };
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
    insert(JSON.parse(message.toString()));
  });

  stream.consumer.on("event.error", function (err: any) {
    console.log(err);
  });
};
startServer();
