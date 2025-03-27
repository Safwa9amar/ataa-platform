const prisma = require("../models/index");

const getAllPlans = async () => {
  const plans = await prisma.plan.findMany({
    include: {
      features: true, // Includes related features for each plan
    },
  });

  // Grouping plans based on their category (Donor or Charity)
  const groupedPlans = plans.reduce((groups, plan) => {
    const category = plan.for; // Either DONOR or CHARITY
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(plan);
    return groups;
  }, {});

  return groupedPlans;
};

const getPlanById = async (planId) => {
  return await prisma.plan.findUnique({
    where: { id: planId },
    include: {
      features: true, // Includes related features
    },
  });
};

const createPlan = async (planData) => {
  return await prisma.plan.create({
    data: {
      title: planData.title,
      description: planData.description,
      price: parseFloat(planData.price),
      paymentLink: planData.paymentLink,
      features: {
        create: planData.features.map((feature) => ({
          title: feature.title,
          description: feature.description,
        })),
      },
    },
    include: {
      features: true, // Includes features after creation
    },
  });
};

const updatePlan = async (planId, planData) => {
  return await prisma.plan.update({
    where: { id: planId },
    data: {
      title: planData.title,
      description: planData.description,
      price: parseFloat(planData.price),
      paymentLink: planData.paymentLink,
      features: {
        upsert: planData.features.map((feature) => ({
          where: { id: feature.id },
          update: { title: feature.title, description: feature.description },
          create: { title: feature.title, description: feature.description },
        })),
      },
    },
    include: {
      features: true,
    },
  });
};

const deletePlan = async (planId) => {
  return await prisma.plan.delete({
    where: { id: planId },
  });
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
};
