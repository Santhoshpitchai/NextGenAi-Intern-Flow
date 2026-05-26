import { MessageType } from "@prisma/client";
import { prisma } from "../config/database.js";


export interface CreateMessageDto {
  content: string;
  type?: MessageType;
  metadata?: any;
}

export const messageService = {
  async createMessage(senderId: string, data: CreateMessageDto) {
    const message = await prisma.message.create({
      data: {
        senderId,
        content: data.content,
        type: data.type || "TEXT",
        metadata: data.metadata,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            intern: {
              select: {
                fullName: true,
                profilePhoto: {
                  select: {
                    publicUrl: true,
                  },
                },
              },
            },
            companyAdmin: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    // Automatically check for tagged users in metadata to create notifications
    if (data.metadata?.taggedUserIds && Array.isArray(data.metadata.taggedUserIds)) {
      const senderName = message.sender.intern?.fullName || message.sender.companyAdmin?.fullName || message.sender.email;
      
      const notificationPromises = data.metadata.taggedUserIds.map((targetUserId: string) => {
        return prisma.notification.create({
          data: {
            userId: targetUserId,
            type: "MENTION",
            title: `New Team Briefing from ${senderName}`,
            body: data.metadata.subject ? `[${data.metadata.subject}] ${data.content.slice(0, 100)}` : data.content.slice(0, 150),
            actionUrl: "/intern/chat",
          },
        });
      });

      try {
        await Promise.all(notificationPromises);
      } catch (err) {
        console.error("Failed to create notifications for tagged users:", err);
      }
    }

    return message;
  },

  async getMessages(limit = 100, before?: Date) {
    return prisma.message.findMany({
      where: {
        deletedAt: null,
        ...(before && {
          createdAt: {
            lt: before,
          },
        }),
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            intern: {
              select: {
                fullName: true,
                profilePhoto: {
                  select: {
                    publicUrl: true,
                  },
                },
              },
            },
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
      take: limit,
    });
  },

  async deleteMessage(messageId: string) {
    return prisma.message.update({
      where: { id: messageId },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
