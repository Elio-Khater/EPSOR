module.exports = {
  produce: function (message: any) {
    const Kafka = require("node-rdkafka");

    const producer = new Kafka.Producer({
      //'debug' : 'all',
      "metadata.broker.list": "localhost:9092",
      dr_cb: true, //delivery report callback
    });

    const topicName = "products";

    //logging debug messages, if debug is enabled
    producer.on("event.log", function (log: any) {
      console.log(log);
    });

    //logging all errors
    producer.on("event.error", function (err: any) {
      console.error("Error from producer");
      console.error(err);
    });

    producer.on("delivery-report", function (err: any, report: any) {
      console.log("delivery-report: " + JSON.stringify(report));
      if (err) {
        console.error(err);
      }
    });

    //Wait for the ready event before producing
    producer.on("ready", function (arg: any) {
      console.log("producer ready." + JSON.stringify(arg));

      let value = Buffer.from(JSON.stringify(message));

      // if partition is set to -1, librdkafka will use the default partitioner
      var partition = -1;
      producer.produce(topicName, partition, value, Date.now());

      //need to keep polling for a while to ensure the delivery reports are received
      var pollLoop = setInterval(function () {
        clearInterval(pollLoop);
        producer.disconnect();
      }, 1000);
    });

    producer.on("disconnected", function (arg: any) {
      console.log("producer disconnected. " + JSON.stringify(arg));
    });

    //starting the producer
    producer.connect();
  },
};
