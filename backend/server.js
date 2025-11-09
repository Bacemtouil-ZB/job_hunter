import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./DB/config.js";
import fs from "fs";
dotenv.config();

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUERBASEURL,
};

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

app.get("/rendom", (req, res) => {
  res.json({ random: Math.random() });
});

//routes
const routeFiles = fs.readdirSync("./routes");
routeFiles.forEach((file) => {
  import(`./routes/${file}`)
    .then((route) => {
      app.use(route.default);
    })
    .catch((error) => {
      console.log("error importing route", error);
    });
});

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
