import { Request, Response } from "express";
import cloudinary from "../libs/cloudinary";
import repliesServices from "../services/replies-services";
import { createValidation, updateValidation } from "../utils/validator/replies-validation";
import ReplyQueue from "../queue/ReplyQueue";

export default new (class RepliesController {
  async create(req: Request, res: Response) {
    try {
      const userId = res.locals.loginSession.id;
      const data = {
        content: req.body.content,
        image: req.file ? req.file.filename : null,
      };

      const { error, value } = createValidation.validate(data);
      if (error) return res.status(400).json(error);

      let cloudinaryRes = null;
      if (req.file) {
        cloudinaryRes = await cloudinary.destination(value.image);
      }

      const obj = {
        ...value,
        user: userId,
        threads: Number(req.body.threads),
        image: cloudinaryRes,
      };

      const response = await repliesServices.create(obj);
      return res.status(201).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // async create(req: Request, res: Response) {
  //   ReplyQueue.create(req, res);
  // }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Invalid ID provided",
          error: "Invalid input for type number",
        });
      }

      const userId = res.locals.loginSession.id;
      const data = {
        content: req.body.content,
        image: req.file ? req.file.filename : null,
      };

      const { error, value } = updateValidation.validate(data);
      if (error) return res.status(400).json(error);

      const cloudinaryRes = await cloudinary.destination(value.image);

      const obj = {
        ...value,
        user: userId,
        image: cloudinaryRes.secure_url,
        threads: parseInt(req.body.threadsId, 10),
      };

      const response = await repliesServices.update(id, obj);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Invalid ID provided",
          error: "Invalid input for type number",
        });
      }

      const response = await repliesServices.delete(id);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const response = await repliesServices.getAll(req.query);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Invalid ID provided",
          error: "Invalid input for type number",
        });
      }

      const response = await repliesServices.getById(id);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
})();
