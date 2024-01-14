// db.js
import mongoose from "mongoose";

const connection = {};
const models = {};

async function connect() {
  if (connection.isConnected) {
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.isConnected = mongoose.connections[0].readyState;
  console.log("MongoDB connected");
}

async function disconnect() {
  if (connection.isConnected) {
    await mongoose.disconnect();
    connection.isConnected = false;
    console.log("MongoDB disconnected");
  }
}

function getConnection() {
  return connection;
}

export { connect, disconnect, getConnection };
