import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./DB/config.js";
import fs from "fs";
import helmet from "helmet";
import User from "./models/UserModel.js";
import asyncHandler from "express-async-handler";
import http from "http";
import { Server } from "socket.io";

// NEW: Import manually loaded routes
import profileRoutes from './routes/profile.js';
import cvRoutes from './routes/cv.js';
import jobMatchRoutes from './routes/jobMatcherRoutes.js';

dotenv.config();

const app = express();

// ---------------- CSP + Security ----------------
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "connect-src": ["'self'", "http://localhost:8000"],
      },
    },
  })
);

// Dummy route to silence Chrome DevTools request
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.json({});
});
// -------------------------------------------------

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUERBASEURL,
};

// ---------------- MIDDLEWARES ----------------
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(auth(config));

// ---------------- HELPER FUNCTIONS ----------------
const ensureUserInDB = asyncHandler(async (user) => {
  try {
    const existingUser = await User.findOne({ auth0Id: user.sub });

    if (!existingUser) {
      const newUser = new User({
        auth0Id: user.sub,
        email: user.email,
        name: user.name || user.nickname || "",
        role: "jobseeker",
        profilePicture: user.picture,
      });
      await newUser.save();
      console.log("User added to DB:", newUser);
    } else {
      console.log("User already exists in DB:", existingUser);
    }
  } catch (error) {
    console.log("Error checking/adding user:", error.message);
  }
});

// ---------------- ROUTES ----------------
app.get("/", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    await ensureUserInDB(req.oidc.user);
    return res.redirect(process.env.CLIENT_URL);
  } else {
    return res.send("logged out");
  }
});

// Test route
app.get("/rendom", (req, res) => {
  res.json({ random: Math.random() });
});

// ---------------- SERVER START ----------------
const server = async () => {
  try {
    console.log("Trying to connect to MongoDB...");
    await connect();
    console.log("Mongo connected successfully!");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
  }

  // 🔹 NEW: Manually loaded routes FIRST
  app.use('/api/profile', profileRoutes);
  console.log('✅ Profile routes loaded at /api/profile');
  
  app.use('/api/cv', cvRoutes);
  console.log('✅ CV routes loaded at /api/cv');
  
  app.use('/api/job-match', jobMatchRoutes);
  console.log('✅ Job Match routes loaded at /api/job-match');

  // 🔹 Dynamic routes (skip manually loaded ones)
  const routeFiles = fs.readdirSync("./routes");
  for (const file of routeFiles) {
    // Skip manually loaded routes
    if (['profile.js', 'cv.js', 'jobMatcherRoutes.js'].includes(file)) {
      console.log(`⏭️ Skipping ${file} (already loaded manually)`);
      continue;
    }
    
    try {
      const route = await import(`./routes/${file}`);
      app.use("/api/v1/", route.default);
      console.log(`✅ Route loaded: ${file}`);
    } catch (error) {
      console.log(`❌ Error loading ${file}:`, error);
    }
  }

  // ---------------- SOCKET.IO SETUP ----------------
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log("User joined room:", userId);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      io.to(receiverId).emit("receiveMessage", {
        senderId,
        text,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  // ---------------- START SERVER ----------------
  try {
    httpServer.listen(process.env.PORT, () => {
      console.log(`🚀 Server with Socket.io running at http://localhost:${process.env.PORT}`);
      console.log(`📍 API Routes available:`);
      console.log(`   - Profile: http://localhost:${process.env.PORT}/api/profile`);
      console.log(`   - CV: http://localhost:${process.env.PORT}/api/cv/generate`);
      console.log(`   - Job Match: http://localhost:${process.env.PORT}/api/job-match`);
    });
  } catch (error) {
    console.log("Server error", error.message);
  }
};

server();