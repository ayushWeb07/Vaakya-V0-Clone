import puppeteer from "puppeteer";
import ImageKit from "imagekit";
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

// configue imagekit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

const captureThumbnailAndUpload = async (sandboxUrl: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 2,
  });

  await page.goto(sandboxUrl, {
    waitUntil: "networkidle2",
    timeout: 60_000,
  });

  const screenshot = await page.screenshot({
    type: "png",
    fullPage: false,
  });

  await browser.close();

  const buffer = Buffer.from(screenshot);

  const uploadResult = await imagekit.upload({
    file: buffer,
    fileName: "sandbox-thumbnail.png",
    folder: "/sandboxes",
  });

  return {
    imageUrl: uploadResult?.url,
    fileId: uploadResult?.fileId,
  };
};

export { getTimeWorkedFor, captureThumbnailAndUpload };
