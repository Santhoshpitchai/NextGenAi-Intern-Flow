import { Request, Response, NextFunction } from "express";
import { attendanceService } from "../services/attendance.service.js";

export const attendanceController = {
  async checkIn(_req: Request, res: Response, next: NextFunction) {
    try {
      const userId = _req.user!.id;
      const record = await attendanceService.checkIn(userId);
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  },

  async checkOut(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const record = await attendanceService.checkOut(userId);
      res.status(200).json(record);
    } catch (error) {
      next(error);
    }
  },

  async getMyRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
      const records = await attendanceService.getMyAttendance(userId, limit);
      res.json(records);
    } catch (error) {
      next(error);
    }
  },

  async getTodayRecords(_req: Request, res: Response, next: NextFunction) {
    try {
      const records = await attendanceService.getTodayAttendance();
      res.json(records);
    } catch (error) {
      next(error);
    }
  },

  async getAllRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const records = await attendanceService.getAllAttendance(limit);
      res.json(records);
    } catch (error) {
      next(error);
    }
  },
};
