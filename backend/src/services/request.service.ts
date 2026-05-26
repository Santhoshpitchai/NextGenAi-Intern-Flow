import { RequestType, RequestStatus } from "@prisma/client";
import { prisma } from "../config/database.js";

export interface CreateRequestDto {
  type: RequestType;
  title: string;
  description: string;
}

export interface UpdateRequestDto {
  status?: RequestStatus;
  response?: string;
}

export const requestService = {
  async createRequest(userId: string, data: CreateRequestDto) {
    return prisma.request.create({
      data: {
        createdById: userId,
        type: data.type,
        title: data.title,
        description: data.description,
        status: "PENDING",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
            intern: {
              select: {
                fullName: true,
              },
            },
          },
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            companyAdmin: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });
  },

  async getMyRequests(userId: string) {
    return prisma.request.findMany({
      where: {
        createdById: userId,
        deletedAt: null,
      },
      include: {
        createdBy: {
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
        reviewedBy: {
          select: {
            id: true,
            email: true,
            companyAdmin: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getAllRequests() {
    return prisma.request.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
            intern: {
              select: {
                fullName: true,
                college: true,
              },
            },
          },
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            companyAdmin: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getRequestById(requestId: string) {
    return prisma.request.findUnique({
      where: { id: requestId },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
            intern: {
              select: {
                fullName: true,
              },
            },
          },
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            companyAdmin: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });
  },

  async updateRequest(requestId: string, reviewerId: string, data: UpdateRequestDto) {
    return prisma.request.update({
      where: { id: requestId },
      data: {
        status: data.status,
        response: data.response,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
      },
      include: {
        createdBy: {
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
        reviewedBy: {
          select: {
            id: true,
            email: true,
            companyAdmin: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });
  },

  async deleteRequest(requestId: string) {
    return prisma.request.update({
      where: { id: requestId },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
