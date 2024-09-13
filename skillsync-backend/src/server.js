import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import app from "./app.js";
import { schedule } from "node-cron";
import generateDailyAnalytics from "./analytics/generateDailyAnalytics.js";
import { integratedController } from "./controllers/integratedController.js";
import { setupSocket } from "./socket/socketManager.js";

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/skillsync";
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:4200";

// CORS configuration
const corsOptions = {
  origin: corsOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Create HTTP server
const server = createServer(app);

// Set up Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// MongoDB connection
connect(mongoURI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Integrate new cross-functional routes
app.use('/api/integrated', integratedController);

// Set up socket connections
setupSocket(io);

// Schedule daily analytics generation
schedule("0 0 * * *", generateDailyAnalytics);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export { io };
export default server;
