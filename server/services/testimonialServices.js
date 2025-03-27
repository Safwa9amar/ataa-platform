const prisma = require("../models/index");

// Fetch all testimonials
const getTestimonialsService = async () => {
  return await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" }, // Sort testimonials by creation date, newest first
    include: {
      user: {
        select: {
          name: true,
          email: true,
          photo: true,
          role: true,
        },
      },
    },
  });
};

// Fetch a single testimonial by ID
const getTestimonialByIdService = async (id) => {
  return await prisma.testimonial.findUnique({
    where: {
      id: id,
    },
  });
};

// Create a new testimonial
const createTestimonialService = async ({ grade, comment, rating }, id) => {
  return await prisma.testimonial.create({
    data: {
      userId: id,
      grade,
      comment,
      rating,
    },
  });
};

// Update an existing testimonial by ID
const updateTestimonialService = async (
  id,
  { name, grade, comment, rating }
) => {
  return await prisma.testimonial.update({
    where: {
      id: id,
    },
    data: {
      name,
      grade,
      comment,
      rating,
    },
  });
};

// Delete a testimonial by ID
const deleteTestimonialService = async (id) => {
  return await prisma.testimonial.delete({
    where: {
      id: id,
    },
  });
};

module.exports = {
  getTestimonialsService,
  getTestimonialByIdService,
  createTestimonialService,
  updateTestimonialService,
  deleteTestimonialService,
};
