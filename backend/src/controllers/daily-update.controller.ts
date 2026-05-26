import { Request, Response, NextFunction } from "express";
import { dailyUpdateService } from "../services/daily-update.service";

export const dailyUpdateController = {
  async createUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const update = await dailyUpdateService.createUpdate(userId, req.body);
      res.status(201).json(update);
    } catch (error) {
      next(error);
    }
  },

  async getMyUpdates(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
      const updates = await dailyUpdateService.getMyUpdates(userId, limit);
      res.json(updates);
    } catch (error) {
      next(error);
    }
  },

  async getAllUpdates(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const updates = await dailyUpdateService.getAllUpdates(limit);
      res.json(updates);
    } catch (error) {
      next(error);
    }
  },

  async getUpdateById(req: Request, res: Response, next: NextFunction) {
    try {
      const update = await dailyUpdateService.getUpdateById(req.params.id as string);
      if (!update) {
        return res.status(404).json({ message: "Update not found" });
      }
      return res.json(update);
    } catch (error) {
      return next(error);
    }
  },

  async deleteUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      await dailyUpdateService.deleteUpdate(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
