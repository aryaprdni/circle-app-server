import * as amqp from "amqplib";
import CloudinaryConfig from "../libs/cloudinary";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { Threads } from "../entities/Threads";
import { EventEmitter } from "node:stream";
import { request } from "http";

export default new (class ThreadWorker extends EventEmitter {
  private readonly ThreadWorker: Repository<Threads> = AppDataSource.getRepository(Threads);
  async create(queueName: string, connection: amqp.Connection) {
    try {
      const channel = await connection.createChannel();

      await channel.assertQueue(queueName);

      await channel.consume(queueName, async (message) => {
        if (message !== null) {
          try {
            const data = JSON.parse(message.content.toString());
            console.log(data);
            const cloudinary = data.image ? await CloudinaryConfig.destination(data.image) : null;
            const obj = this.ThreadWorker.create({
              content: data.content,
              image: cloudinary,
              user: {
                id: data.user,
              },
            });

            await this.ThreadWorker.save(obj);

            const req = request({
              hostname: "localhost",
              port: 3000,
              path: "/api/v1/new-thread",
              method: "GET",
            });

            req.on("error", (error) => {
              console.log("Error Message : " + error);
            });
            req.end();

            console.log("Thread is created!");
            channel.ack(message);
          } catch (error) {
            console.log("Proccess queue is failed :", error);
            throw error;
          }
        }
      });
    } catch (error) {
      console.error("WorkerHub error:", error);
    }
  }
})();
