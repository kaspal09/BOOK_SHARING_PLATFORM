const express = require('express');
const ReviewSchema = require('../models/reviewSchema');
const BookSchema = require('../models/bookSchema');
const authenticate = require('../middleware/authMiddleware');
const reviewRouter = express.Router();


// POST /api/books/:id/review - Add a review for a specific book
reviewRouter.post('/:id/', authenticate, async (req, res) => {
    try {
        const { rating, review } = req.body;
        const bookId = req.params.id;  // Extract the bookId from the route parameters
        const userId = req.user._id;   // User is attached from the authenticate middleware
        //check
        const bookExists = await BookSchema.findById(bookId);
        if (!bookExists) {
            return res.status(404).json({ message: 'Book not found' });
        }


        // Create and save the review
        const newReview = new ReviewSchema({
            bookId,      // Attach the bookId
            userId,
            rating,
            review,
        });

        //to save 

        bookExists.reviews.push(newReview);

        await newReview.save();
        await bookExists.save();



        return res.status(201).json(newReview);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error adding review', error });
    }
});

// GET /api/books/:id/eviews - Get all reviews for a specific book
reviewRouter.get('/:bookId/review', async (req, res) => {
    try {
        const bookId = req.params.bookId

        const reviews = await ReviewSchema.find({ bookId })
            .populate('userId', 'name email');  // Populate user info
        return res.status(200).json(reviews);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error fetching reviews', error });
    }
});


// PUT /api/books/:id/review - Update a review for a specific book
reviewRouter.patch('/:id', authenticate, async (req, res) => {
    try {
        const { rating, review } = req.body;
        const reviewId = req.params.id;
        const userId = req.user._id;  // User is attached from the authenticate middleware

        const existingReview = await reviewSchema.findOne({ _id: reviewId, userId });
        if (!existingReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Update the review
        existingReview.rating = rating;
        existingReview.review = review;

        await existingReview.save();
        return res.status(200).json(existingReview);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating review', error });
    }
});

// DELETE /api/books/:id/review - Remove a review for a specific book
reviewRouter.delete('/:id', authenticate, async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.user._id;  // User is attached from the authenticate middleware

        const review = await reviewSchema.findOneAndDelete({ bookId, userId });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting review', error });
    }
});

module.exports = reviewRouter;
