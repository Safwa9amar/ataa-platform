// src/services/rechargeService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Get all recharges
 */
async function getAllRecharges(createdAt, page = 1, limit = 10) {
  let where = {};
  if (createdAt !== undefined || createdAt !== "undefined" ) {
    where = {
      createdAt: {
        gte: new Date(createdAt),
      },
    };
  }
  return await prisma.recharge.findMany({
    where: where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: true,
    }, // Assuming you want to include related user data
  });
}

/**
 * Get a recharge by ID
 */
async function getRechargeById(id) {
  return await prisma.recharge.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

/**
 * Create a new recharge
 */
async function createRecharge(rechargeData) {
  const recharge = await prisma.recharge.create({
    data: rechargeData,
  });
  let rechargeAmount = recharge.amount;
  let userId = recharge.userId;
  //   update currentBalance in user table
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });
  let currentBalance = user.currentBalance;
  let newBalance = currentBalance + rechargeAmount;
  await prisma.users.update({
    where: { id: userId },
    data: { currentBalance: newBalance },
  });
  return recharge;
}

/**
 * Update a recharge by ID
 */
async function updateRecharge(id, rechargeData) {
  return await prisma.recharge.update({
    where: { id },
    data: rechargeData,
  });
}

/**
 * Delete a recharge by ID
 */
async function deleteRecharge(id) {
  return await prisma.recharge.delete({
    where: { id },
  });
}

module.exports = {
  getAllRecharges,
  getRechargeById,
  createRecharge,
  updateRecharge,
  deleteRecharge,
};
