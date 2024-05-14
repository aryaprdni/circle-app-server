import { Request, Response } from "express";
import FollowsService from "../services/follows-services";

export default new (class FollowsController {
  async create(req: Request, res: Response) {
    try {
      const userId = res.locals.loginSession.id;
      const response = await FollowsService.create(req.body, userId);
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
      const followerUserId = Number(req.params.followerUserId);
      const userId = res.locals.loginSession.id;

      if (isNaN(followerUserId)) {
        return res.status(400).json({
          message: "Invalid ID provided",
          error: "Invalid input for type number",
        });
      }
      const response = await FollowsService.delete(followerUserId, userId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async find(req: Request, res: Response) {
    try {
      const userId = res.locals.loginSession.id;
      const limit = (req.query.limit ?? 0) as number;
      const type = (req.query.type ?? "") as string;

      const response = await FollowsService.find(userId, type, limit);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
})();
