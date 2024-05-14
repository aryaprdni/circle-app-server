import { Request, Response } from "express";
import { createValidation, updateValidation } from "../utils/validator/threads-validation";
import cloudinary from "../libs/cloudinary";
import ThreadsService from "../services/threads-services";
import ThreadQueue from "../queue/ThreadQueue";

export default new (class ThreadsController {
  async create(req: Request, res: Response) {
    try {
      const userId = res.locals.loginSession.id;
      const data = {
        content: req.body.content,
        image: req.file ? req.file.filename : null,
      };
      console.log(data)

      const { error, value } = createValidation.validate(data);
      if (error) return res.status(400).json(error);

      let cloudinaryRes = null;
      if (req.file) {
        cloudinaryRes = await cloudinary.destination(value.image);
      }

      const obj = {
        ...value,
        user: userId,
        image: cloudinaryRes,
      };

      const response = await ThreadsService.create(obj);
      return res.status(201).json(response);
    } catch (error) {
      console.error("Error in ThreadsController create method:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
  // async create(req: Request, res: Response) {
  //   ThreadQueue.create(req, res);
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

      const data = {
        content: req.body.content,
        image: req.file ? req.file.filename : null,
      };

      const { error, value } = updateValidation.validate(data);
      if (error) return res.status(400).json(error);

      const cloudinaryRes = await cloudinary.destination(value.image);

      const obj = {
        ...value,
        image: cloudinaryRes.secure_url,
      };

      const response = await ThreadsService.update(id, obj);
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

      const response = await ThreadsService.delete(id);
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
      const loginSession = res.locals.loginSession.id;
      const response = await ThreadsService.getAll(loginSession);
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
      const loginSession = res.locals.loginSession.id;
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Invalid ID provided",
          error: "Invalid input for type number",
        });
      }

      const response = await ThreadsService.getById(id, loginSession);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
})();
