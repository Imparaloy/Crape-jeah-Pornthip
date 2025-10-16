import { createApp } from "../src/app.js";
import { connect, disconnect } from "../src/db.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

export const setupTestServer = async () => {
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  await connect(uri);
  return createApp();
};

export const teardownDb = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase().catch(() => {});
  }
  await disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
