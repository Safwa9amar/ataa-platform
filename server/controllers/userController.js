// src/controllers/userController.js
const userService = require("../services/userService");
const validator = require("validator");

/**
 * Get all users
 */
async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers(
      req.params.keywords,
      req.params.timestamp
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}

/**
 * Get user by ID
 */
async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
}

/**
 * Create a new user
 */
async function createUser(req, res) {
  const userData = req.body;
  try {
    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
}

/**
 * Update a user
 */
async function updateUser(req, res) {
  const { trialEndDate, ...updates } = req.body;
  const { id } = req.user;

  // Prevent updating trialEndDate from the request
  if (trialEndDate) {
    return res.status(403).json({ message: "bad request" });
  }
  try {
    const updatedUser = await userService.updateUser(id, updates, req.file);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Error updating user", error });
  }
}
/**
 * Update a user adress
 */
async function updateUserAddress(req, res) {
  const { trialEndDate, ...updates } = req.body;
  const { id } = req.user;

  // Prevent updating trialEndDate from the request
  if (trialEndDate) {
    return res.status(403).json({ message: "bad request" });
  }
  try {
    const updatedUser = await userService.updateUserAddress(id, updates);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Error updating user", error });
  }
}
/**
 * Update a user password
 */

/**
 * Update a user password
 */
async function updateUserPassword(req, res) {
  const { id } = req.user;
  const { trialEndDate, currentPassword, newPassword } = req.body;

  // Prevent updating trialEndDate from the request
  if (trialEndDate) {
    return res.status(403).json({ message: "طلب غير صالح" });
  }

  // Validate new password
  if (!validator.isLength(newPassword, { min: 8 })) {
    return res.status(400).json({
      message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
    });
  }
  if (
    !validator.isStrongPassword(newPassword, {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({
      message: "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز خاص.",
    });
  }

  try {
    const updatedUser = await userService.updatePassword(
      id,
      currentPassword,
      newPassword
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);

    if (error.message === "كلمة المرور الحالية غير صحيحة.") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error updating user password:", error.message);
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء تحديث كلمة المرور.", error });
  }
}

/**
 * Delete a user
 */
async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  updateUserAddress,
};
