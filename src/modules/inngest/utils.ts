import { prisma } from "@/lib/db";

// show the time ago
const getTimeWorkedFor = async (projectId: string) => {
  // get the last message
  const lastMessage = await prisma.message.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      projectId,
    },
  });

  // calculate the time between the last message sent and now
  const diffMs =
    Date.now() - new Date(lastMessage?.createdAt as Date).getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;

  return `${seconds}s`;
};




export { getTimeWorkedFor };
