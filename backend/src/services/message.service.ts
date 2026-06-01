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
      const senderName =
        message.sender.intern?.fullName ||
        message.sender.companyAdmin?.fullName ||
        message.sender.email;

      const notificationPromises = data.metadata.taggedUserIds.map((targetUserId: string) => {
        return prisma.notification.create({
          data: {
            userId: targetUserId,
            type: "MENTION",
            title: `New Team Briefing from ${senderName}`,
            body: data.metadata.subject
              ? `[${data.metadata.subject}] ${data.content.slice(0, 100)}`
              : data.content.slice(0, 150),
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

  async getMessages(userId: string, limit = 100, before?: Date) {
    const rawMessages = await prisma.message.findMany({
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
      take: limit * 5, // fetch more to account for in-memory filtering
    });

    const filteredMessages = rawMessages.filter((msg) => {
      // Always show messages sent by the user
      if (msg.senderId === userId) return true;

      let metadata = msg.metadata as any;
      if (typeof metadata === "string") {
        try {
          metadata = JSON.parse(metadata);
        } catch (e) {
          // ignore
        }
      }

      // If there are no tagged users, it's a public message
      if (
        !metadata ||
        !metadata.taggedUserIds ||
        !Array.isArray(metadata.taggedUserIds) ||
        metadata.taggedUserIds.length === 0
      ) {
        return true;
      }

      // If there are tagged users, only show if the current user is tagged
      return metadata.taggedUserIds.includes(userId);
    });

    return filteredMessages.slice(0, limit);
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
