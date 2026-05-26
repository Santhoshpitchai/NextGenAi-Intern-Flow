import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

const getTodayDate = () => {
  const today = new Date();
  return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
};

export const attendanceService = {
  async checkIn(userId: string) {
    const todayDate = getTodayDate();

    // Check if the user already has a check-in today
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: todayDate,
        },
      },
    });

    if (existing) {
      throw ApiError.badRequest("You have already checked in for today.");
    }

    return prisma.attendance.create({
      data: {
        userId,
        checkIn: new Date(),
        date: todayDate,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            intern: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });
  },

  async checkOut(userId: string) {
    const todayDate = getTodayDate();

    // Find today's attendance record
    const record = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: todayDate,
        },
      },
    });

    if (!record) {
      throw ApiError.notFound("No check-in record found for today. Please check in first.");
    }

    if (record.checkOut) {
      throw ApiError.badRequest("You have already checked out for today.");
    }

    return prisma.attendance.update({
      where: {
        id: record.id,
      },
      data: {
        checkOut: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            intern: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });
  },

  async getMyAttendance(userId: string, limit = 30) {
    return prisma.attendance.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    });
  },

  async getTodayAttendance() {
    const todayDate = getTodayDate();
    return prisma.attendance.findMany({
      where: {
        date: todayDate,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            intern: {
              select: {
                fullName: true,
                college: true,
                specialization: true,
              },
            },
          },
        },
      },
      orderBy: {
        checkIn: "desc",
      },
    });
  },

  async getAllAttendance(limit = 100) {
    return prisma.attendance.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            intern: {
              select: {
                fullName: true,
                college: true,
                specialization: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    });
  },
};
