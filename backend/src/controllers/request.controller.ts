import { Request, Response, NextFunction } from "express";
import { requestService } from "../services/request.service";

export const requestController = {
  async createRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const request = await requestService.createRequest(userId, req.body);
      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  },

  async getMyRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const requests = await requestService.getMyRequests(userId);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  },

  async getAllRequests(_req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await requestService.getAllRequests();
      res.json(requests);
    } catch (error) {
      next(error);
    }
  },

  async getRequestById(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await requestService.getRequestById(req.params.id as string);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      return res.json(request);
    } catch (error) {
      return next(error);
    }
  },

  async updateRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewerId = req.user!.id;
      const request = await requestService.updateRequest(
        req.params.id as string,
        reviewerId,
        req.body,
      );
      res.json(request);
    } catch (error) {
      next(error);
    }
  },

  async deleteRequest(req: Request, res: Response, next: NextFunction) {
    try {
      await requestService.deleteRequest(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
