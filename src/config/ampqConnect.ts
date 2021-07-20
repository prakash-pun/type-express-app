import * as amqp from 'amqplib';

export const createClient = (setting) => amqp.connect(setting.url)
  .then(conn => conn.createChannel()) // create channel
  .then(channel => {
    console.log("amqp connected");
    return channel;
  });

export const sendRPCMessage = (channel, message, rpcQueue) => new Promise(resolve => {
  channel.sendToQueue(rpcQueue, Buffer.from(message));
});
