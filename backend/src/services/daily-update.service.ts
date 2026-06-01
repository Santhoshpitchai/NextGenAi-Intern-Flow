import { prisma } from "../config/database.js";

export interface CreateDailyUpdateDto {
  summary: string;
  accomplishments?: string;
  challenges?: string;
  nextSteps?: string;
  date?: Date;
}

export const dailyUpdateService = {
  async createUpdate(userId: string, data: CreateDailyUpdateDto) {
    const date = data.date || new Date();

    // Check if update already exists for this date
    const existing = await prisma.dailyUpdate.findUnique({
      where: {
        authorId_date: {
          authorId: userId,
          date: date,
        },
      },
    });

    if (existing) {
      // Update existing
      return prisma.dailyUpdate.update({
        where: { id: existing.id },
        data: {
          summary: data.summary,
          accomplishments: data.accomplishments,
          challenges: data.challenges,
          nextSteps: data.nextSteps,
        },
        include: {
          author: {
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
    }

    // Create new
    return prisma.dailyUpdate.create({
      data: {
        authorId: userId,
        summary: data.summary,
        accomplishments: data.accomplishments,
        challenges: data.challenges,
        nextSteps: data.nextSteps,
        date: date,
      },
      include: {
        author: {
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

  async getMyUpdates(userId: string, limit = 30) {
    return prisma.dailyUpdate.findMany({
      where: {
        authorId: userId,
        deletedAt: null,
      },
      include: {
        author: {
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
      orderBy: {
        date: "desc",
      },
      take: limit,
    });
  },

  async getAllUpdates(limit = 100) {
    return prisma.dailyUpdate.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            intern: {
              select: {
                fullName: true,
                college: true,
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

  async getUpdateById(updateId: string) {
    return prisma.dailyUpdate.findUnique({
      where: { id: updateId },
      include: {
        author: {
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

  async deleteUpdate(updateId: string) {
    return prisma.dailyUpdate.update({
      where: { id: updateId },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
