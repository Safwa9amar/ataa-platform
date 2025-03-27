const express = require("express");
const {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.get("/testimonials", getAllTestimonials); // Get all testimonials
router.get("/testimonials/:id", getTestimonialById); // Get a testimonial by ID
router.post("/testimonials", authenticate, createTestimonial); // Create a new testimonial
router.put("/testimonials/:id", authenticate, updateTestimonial); // Update a testimonial by ID
router.delete("/testimonials/:id", authenticate, deleteTestimonial); // Delete a testimonial by ID

module.exports = router;
