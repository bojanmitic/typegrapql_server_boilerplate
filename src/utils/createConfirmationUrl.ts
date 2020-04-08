import { v4 } from "uuid";
import { redis } from "../redis";
import { CONFIRMATION_PREFIX } from "../modules/constants/redisPrefixes";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(CONFIRMATION_PREFIX + token, userId, "ex", 60 * 60 * 24); // one day

  return `http://localhost:3000/user/confirm/${token}`;
};
