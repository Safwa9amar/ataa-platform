// src/middlewares/setupMiddleware.js
const cors = require("cors");
const express = require("express");
const path = require("path");

module.exports = function setupMiddleware(app) {
  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
  app.use(
    "/app-guid/assets",
    express.static(path.join(__dirname, "../assets"))
  );
};
