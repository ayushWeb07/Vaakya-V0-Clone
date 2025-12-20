"use server";

import { prisma } from "@/lib/db";

const getAllPosts = async () => {
  const posts = await prisma.post.findMany();
  return posts;
};

export { getAllPosts };
