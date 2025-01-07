const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Owner of the book
    review: {
        type: String
    }
});

module.exports = mongoose.model('Book', BookSchema);
