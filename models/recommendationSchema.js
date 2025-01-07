const mongoose = require("mongoose");

// Define the Recommendation Schema
const RecommendationSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", // Reference to the Book model
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Recommendation model from the schema
module.exports = mongoose.model("Recommendation", RecommendationSchema);


