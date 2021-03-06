import * as amqp from "amqplib";

export const amqpConnect = (setting: { url: any }) =>
  amqp
    .connect(setting.url)
    .then((conn) => conn.createChannel()) // create channel
    .then((channel) => {
      console.log("amqp connected");
      return channel;
    });

export const amqpSend = (channel: any, message: any, rpcQueue: any) =>
  new Promise((resolve) => {
    channel.sendToQueue(rpcQueue, Buffer.from(message));
  });
