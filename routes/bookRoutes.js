const express = require('express');
const BookSchema = require('../models/bookSchema');
const ReviewSchema = require("../models/reviewSchema")
const authenticate = require('../middleware/authMiddleware');
const bookRouter = express.Router();


// Add a book to the collection
bookRouter.post('/', authenticate, async (req, res) => {
    try {
        const { title, author, genre, description } = req.body;
        console.log(req.userId)
        const book = new BookSchema({ title, author, genre, description, userId: req.userId });
        await book.save();
        return res.status(201).json({ message: 'Book added to your collection!' });  // Return after response
    } catch (error) {
        console.log(error);
        if (!res.headersSent) {  // Ensure no headers are sent before
            return res.status(500).json({ message: 'Error adding book' });  // Return to prevent further execution
        }
    }
});

// Get all books in the user's collection
bookRouter.get('/', authenticate, async (req, res) => {
    try {
        const books = await BookSchema.find({ userId: req.userId });
        return res.json(books);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving books' });
    }
});


// Delete a book from the collection
bookRouter.delete('/:id', authenticate, async (req, res) => {
    try {
        const book = await BookSchema.findOne(req.params._id);
        console.log(book);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (!book._id) {
            return res.status(400).json({ message: 'Invalid book data, userId is missing' });
        }
        // if (book._id.toString() !== req.userId) {
        //     return res.status(403).json({ message: 'Not authorized' });
        // }

        // Use deleteOne instead of remove()
        await BookSchema.deleteOne({ _id: req.params.id });
        return res.json({ message: 'Book removed from collection' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error removing book' });
    }
});

bookRouter.get('/:bookId/review', async (req, res) => {
    try {
        const bookId = req.params.bookId

        const reviews = await ReviewSchema.find({ bookId })
            .populate('userId', 'username email');  // Populate user info
        return res.status(200).json(reviews);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error fetching reviews', error });
    }
});


module.exports = bookRouter;
