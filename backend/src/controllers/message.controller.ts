import { Request, Response, NextFunction } from "express";
import { messageService } from "../services/message.service";

export const messageController = {
  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const senderId = req.user!.id;
      const message = await messageService.createMessage(senderId, req.body);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  },

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const before = req.query.before ? new Date(req.query.before as string) : undefined;
      const userId = req.user!.id;
      const messages = await messageService.getMessages(userId, limit, before);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  },

  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      await messageService.deleteMessage(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
