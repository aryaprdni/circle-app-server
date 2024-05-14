import { Request, Response } from "express";
import likesServices from "../services/likes-services";
import { createValidation, deleteValidation } from "../utils/validator/likes-validation";

export default new (class LikesController {
  async create(req: Request, res: Response) {
    try {
      const loginSession = res.locals.loginSession.id;

      const response = await likesServices.create(req.body, loginSession);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = res.locals.loginSession.id;
      const threadId = parseInt(req.params.threadId, 10);
      console.log(threadId);

      if (isNaN(threadId)) {
        return res.status(400).json({
          message: "Invalid ID provided",
          error: "Invalid input for type number",
        });
      }

      const response = await likesServices.delete(threadId, userId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const response = await likesServices.getAll();
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

      const response = await likesServices.getById(id);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
})();
