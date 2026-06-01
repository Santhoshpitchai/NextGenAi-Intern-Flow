import { Request, Response, NextFunction } from "express";
import * as notificationService from "../services/notification.service.js";

export const notificationController = {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const unreadOnly = req.query.unreadOnly === "true";
      const notifications = await notificationService.getNotifications(userId, unreadOnly);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  },

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const count = await notificationService.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const notificationId = req.params.id as string;
      const updated = await notificationService.markAsRead(userId, notificationId);
      if (!updated) {
        return res.status(404).json({ message: "Notification not found" });
      }
      return res.json(updated);
    } catch (error) {
      return next(error);
    }
  },

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await notificationService.markAllAsRead(userId);
      res.json({ count: result.count });
    } catch (error) {
      next(error);
    }
  },
};
