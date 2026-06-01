import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "some-user-id"; // just testing compilation
  const messages = await prisma.message.findMany({
    where: {
      deletedAt: null,
      OR: [
        { senderId: userId },
        {
          metadata: {
            path: ["taggedUserIds"],
            array_contains: userId,
          },
        },
      ],
    },
  });
  console.log(messages);
}

main().catch(console.error);
