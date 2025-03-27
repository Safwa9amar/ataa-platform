// src/services/userService.js
const prisma = require("../models");
const { assignTopDonorRank } = require("../utils/assignTopDonorRank");
const bcrypt = require("bcrypt");
/**
 * Get all users
 */
async function getAllUsers(keywords, timestamp) {
  // Construct the where clause for filtering users
  const whereClause = {};

  // Filter by keywords if provided
  if (keywords) {
    whereClause.OR = [
      { name: { contains: keywords } },
      { email: { contains: keywords } },
    ];
  }

  // Filter by timestamp if provided
  if (timestamp && !isNaN(new Date(timestamp))) {
    whereClause.lastDonation = { gte: new Date(timestamp) };
  }
  // whereClause.isVisible = true;

  // Fetch all users from the database with filters applied
  let users = await prisma.users.findMany({
    where: whereClause,
    orderBy: {
      totalDonatedAmount: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      isVisible: true,
      totalDonatedAmount: true,
      ambassadorRank: true,
      lastDonation: true,
      donations: true,
      recharges: true,
      sharedLinks: true,
    },
  });

  // Map over the users array to assign the topDonorRank
  users = assignTopDonorRank(users);

  return users;
}

/**
 * Get a user by ID
 * @param {number} id - User ID
 */
async function getUserById(id) {
  return await prisma.users.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

/**
 * Create a new user
 * @param {object} userData - User data
 */
async function createUser(userData) {
  return await prisma.users.create({
    data: userData,
  });
}

/**
 * Update a user by ID
 * @param {number} id - User ID
 * @param {object} userData - User data
 */
async function updateUser(id, userData, file) {
  const { name, password, phone, isVisible } = userData;
  // Initialize the data object
  delete userData.confirmPassword;
  const data = userData;
  if (name) data.name = name;

  data.isVisible =
    typeof isVisible === "string"
      ? isVisible === "true"
        ? true
        : false
      : parseInt(isVisible) === 1
      ? true
      : false;
  if (phone) data.phone = phone;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;
  }

  if (file && file.filename) data.photo = file.filename;
  await prisma.image.create({
    data: { ...file },
  });

  return await prisma.users.update({
    where: { id: id },
    data: data,
  });
}
async function updateUserAddress(id, userData) {
  let addr = await prisma.address.findFirst({
    where: {
      user: {
        id: id,
      },
    },
  });
  if (addr) {
    await prisma.address.delete({
      where: {
        id: addr.id,
      },
    });
  }

  return await prisma.users.update({
    where: { id: id },
    data: {
      age: userData.age,
      address: {
        create: userData.address,
      },
    },
    include: {
      address: true,
    },
  });
}

/**
 * Delete a user by ID
 * @param {number} id - User ID
 */
async function deleteUser(id) {
  return await prisma.users.delete({
    where: { id: parseInt(id, 10) },
  });
}

/**
 * تحديث كلمة مرور المستخدم
 * @param {number} userId - معرّف المستخدم
 * @param {string} currentPassword - كلمة المرور الحالية للتحقق
 * @param {string} newPassword - كلمة المرور الجديدة للتحديث
 */
async function updatePassword(userId, currentPassword, newPassword) {
  // البحث عن المستخدم في قاعدة البيانات
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("المستخدم غير موجود.");
  }

  // التحقق من صحة كلمة المرور الحالية
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("كلمة المرور الحالية غير صحيحة.");
  }

  // تشفير كلمة المرور الجديدة
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // تحديث كلمة المرور في قاعدة البيانات
  await prisma.users.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return { message: "تم تحديث كلمة المرور بنجاح." };
}
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  updateUserAddress,
};
