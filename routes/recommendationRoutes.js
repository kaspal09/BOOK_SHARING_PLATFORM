const express = require('express');
const recommendationSchema = require('../models/recommendationSchema');
const bookSchema = require('../models/bookSchema');
const userSchema = require('../models/userSchema');
const recommendationRouter = express.Router();

// POST route to create a new book recommendation
recommendationRouter.post("/recommendation", async (req, res) => {
    const { bookId, userId, message } = req.body;

    try {
        // Find the book and user to ensure they exist
        const book = await bookSchema.findById(bookId);
        const user = await userSchema.findById(userId);

        if (!book || !user) {
            return res.status(404).json({ message: "Book or User not found" });
        }

        // Create a new recommendation document
        const newRecommendation = new recommendationSchema({
            bookId,
            userId,
            message,
        });

        // Save the recommendation
        await newRecommendation.save();

        res.status(201).json({
            message: "Recommendation added successfully!",
            recommendationschema: newRecommendation,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while posting the recommendation." });
    }
});

// GET route to fetch all recommendations
recommendationRouter.get("/recommendation", async (req, res) => {
    try {
        // Fetch all recommendations, populating book and user data
        const recommendation = await recommendationSchema.find()
            .populate("bookId", "title author") // Populate book details
            .populate("userId", "username")   // Populate user details
            .sort({ createdAt: -1 });          // Sort by latest first

        res.status(200).json(recommendation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while fetching the recommendations." });
    }
});

module.exports = recommendationRouter;