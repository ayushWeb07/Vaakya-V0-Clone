import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "./db";
import { auth } from "@clerk/nextjs/server";

// simple config for the rate limiter
const FREE_POINTS = 5;
const PRO_POINTS = 50;
const PRO_PLUS_POINTS = 100;

const REFRESHES_IN = 30 * 24 * 60 * 60; // 1mo
const POINTS_TO_CONSUME = 1;

// create the reate limiter
const apiLimiter = async () => {
  // allot the poins based on the user's plan
  let points = FREE_POINTS;

  const { has } = await auth();

  const hasProPlan = has({ plan: "pro_user" });
  const hasProPlusPlan = has({ plan: "pro_plus_user" });

  if (hasProPlan) {
    points = PRO_POINTS;
  } else if (hasProPlusPlan) {
    points = PRO_PLUS_POINTS;
  }

  const limiter = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: points, // requests alloted based on the user's plan
    duration: REFRESHES_IN, // per 1 month
  });

  return limiter;
};

// consume points
const consumePoints = async () => {
  // get the userId as the key
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // consume the points
  const limiter = await apiLimiter();
  const result = await limiter.consume(userId, POINTS_TO_CONSUME);

  if (!result) {
    return null;
  } else {
    return {
      remainingPoints: result.remainingPoints,
      msBeforeNext: result.msBeforeNext,
    };
  }

};

// get usage status
const usageStatus = async () => {
  // get the userId as the key
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // consume the points
  const limiter = await apiLimiter();
  const result = await limiter.get(userId);

  if (!result) {
    return null;
  } else {
    return {
      remainingPoints: result.remainingPoints,
      msBeforeNext: result.msBeforeNext,
    };
  }
};

export { apiLimiter, consumePoints, usageStatus };
