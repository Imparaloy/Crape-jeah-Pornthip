import mongoose from "mongoose";

export const connect = async (dbUrl) => {
  const url = dbUrl || process.env.DB_URL;
  if (!url) {
    throw new Error("DB_URL is not set");
  }
  await mongoose.connect(url);
  return mongoose.connection;
};

export const disconnect = async () => {
  await mongoose.disconnect();
};
