import { Request, Response } from "express";
import RabbitMQConfig from "../libs/rabbitmq";
import { createValidation } from "../utils/validator/replies-validation";
import { redisClient } from "../libs/redis";

export default new (class ReplyQueue {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = {
        content: req.body.content,
        image: res.locals.filename,
      };

      const { error, value } = createValidation.validate(data);
      if (error) return res.status(400).json(error.details[0].message);

      const userId = res.locals.loginSession.id;
      const payload = {
        content: value.content,
        image: value.image,
        threads: Number(req.body.threads),
        user: userId,
      };

      const errorQueue = await RabbitMQConfig.sendToMessage(process.env.REPLY_QUEUE, payload);
      if (errorQueue) return res.status(500).json({ message: errorQueue });

      return res.status(201).json({
        message: "reply is queued!!",
        data: payload,
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
})();
