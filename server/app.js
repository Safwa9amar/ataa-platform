// src/app.js
const express = require("express");
const setupMiddleware = require("./middlewares/setupMiddleware");
const setupMailer = require("./utils/mailer");
const apiRouter = require("./routers/apiRouter");
const path = require("path");
const app = express();
const setupSocketHandlers = require("./socketHandlers");
const useragent = require("express-useragent");
// Setup middlewares\
const http = require("http");
const { Server } = require("socket.io");
const { ChargilyClient } = require("@chargily/chargily-pay");
const bodyParser = require("body-parser");

const chargilyClient = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY,
  mode: "test", // Change to 'live' when deploying your application
});

// Middleware to capture raw body as Buffer
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
});
// Store the `io` instance globally
app.set("io", io);

app.use(useragent.express());

// Configure Nodemailer
app.locals.transporter = setupMailer();
app.locals.upload = path.join(__dirname, "uploads");
app.locals.templates = path.join(__dirname, "templates");
app.locals.outputs = path.join(__dirname, "output");

setupSocketHandlers(io);
setupMiddleware(app);
// Setup routes
app.use((req, res, next) => {
  req.io = io;
  req.chargilyClient = chargilyClient;

  next();
}, apiRouter);

module.exports = server;
