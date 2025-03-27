// src/routers/categoryRouter.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/app-guid", (req, res) => {
  // Path to the directory containing images
  const imagesDirectory = path.join(__dirname, "./../assets");
  console.log(imagesDirectory);
  // Get all image files from the directory
  const images = fs
    .readdirSync(imagesDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);
  // Map the images to URLs
  const obj = {};
  const imageUrls = images.map((image) => {
    obj[image.split(".")[0]] = `${req.protocol}://${req.get(
      "host"
    )}/app-guid/assets/${image}`;
    return obj;
  });
  // Send the list of image URLs as the response

  res.json(imageUrls[0]);
});

module.exports = router;
