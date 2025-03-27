// src/routers/userRouter.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadImageMiddleware");
const restrictFieldUpdate = require("../middlewares/restrictFieldUpdate");
const authenticate = require("../middlewares/authMiddleware");

// Define routes
router.get("/users/:timestamp?/:keywords?", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users/", userController.createUser);
router.put(
  "/users/:id?",
  authenticate,
  restrictFieldUpdate,
  upload.single("file"),
  userController.updateUser
);
router.put(
  "/users/adress/:id?",
  authenticate,
  restrictFieldUpdate,
  userController.updateUserAddress
);
router.put(
  "/users/password",
  authenticate,
  restrictFieldUpdate,
  userController.updateUserPassword
);
router.delete("/users/:id", authenticate, userController.deleteUser);

module.exports = router;
