const {
  getTestimonialsService,
  getTestimonialByIdService,
  createTestimonialService,
  updateTestimonialService,
  deleteTestimonialService,
} = require("../services/testimonialServices");

// Get all testimonials
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await getTestimonialsService();
    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials." });
  }
};

// Get a single testimonial by ID
const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await getTestimonialByIdService(id);

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found." });
    }

    res.status(200).json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial by ID:", error);
    res.status(500).json({ error: "Failed to fetch testimonial." });
  }
};

// Create a new testimonial
const createTestimonial = async (req, res) => {
  try {
    const { name, grade, comment, rating } = req.body;

    if (!grade || !comment || rating === undefined) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newTestimonial = await createTestimonialService(
      {
        grade,
        comment,
        rating,
      },
      req.user.id
    );
    res.status(201).json(newTestimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ error: "Failed to create testimonial." });
  }
};

// Update a testimonial by ID
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade, comment, rating } = req.body;

    if (!name || !grade || !comment || rating === undefined) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const updatedTestimonial = await updateTestimonialService(id, {
      grade,
      comment,
      rating,
    });

    if (!updatedTestimonial) {
      return res.status(404).json({ error: "Testimonial not found." });
    }

    res.status(200).json(updatedTestimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ error: "Failed to update testimonial." });
  }
};

// Delete a testimonial by ID
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTestimonial = await deleteTestimonialService(id);

    if (!deletedTestimonial) {
      return res.status(404).json({ error: "Testimonial not found." });
    }

    res.status(200).json({ message: "Testimonial deleted successfully." });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ error: "Failed to delete testimonial." });
  }
};

module.exports = {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
