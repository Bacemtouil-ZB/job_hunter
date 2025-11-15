import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./DB/config.js";
import fs from "fs";
import helmet from "helmet";
import User from "./models/UserModel.js"
import asyncHandler from "express-async-handler";



dotenv.config();

const app = express();

// ---------------- CSP + Security Fix ----------------
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
// ----------------------------------------------------

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUERBASEURL,
};

// Middlewares
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
//function to check if user exists in the database
const ensureUserInDB= asyncHandler(async(user)=>{
  try {
    const existingUser = await User.findOne({auth0ID: user.sub});
    if(!existingUser){
      //create new user document
      const newUser = new User({
        auth0Id : user.sub,
        email: user.email,
        name: user.name,
        role:"jobseeker",
        profilePicture:user.picture,
      });
      await newUser.save();
      console.log("user added to DB",user)
    }else{
        console.log("user already exists in db ",existingUser)

  }
  } catch (error) {
    console.log("error checking or adding user to db",error.message);

    
  } 
});

app.get("/",async (req, res) => {
  if (req.oidc.isAuthenticated()){
    //check if auth0 user exists in the db
    await ensureUserInDB(req.oidc.user);
    //redirect to the frontend
    return res.redirect(process.env.CLIENT_URL);

  }else{
    return res.send("logged out");
  }
});

// Test route
app.get("/rendom", (req, res) => {
  res.json({ random: Math.random() });
});

// Auto-load routes
const routeFiles = fs.readdirSync("./routes");
routeFiles.forEach((file) => {
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api/v1/",route.default);
    })
    .catch((error) => {
      console.log("Error importing route", error);
    });
});

// Start server
const server = async () => {
  await connect();
  try {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
};

server();
