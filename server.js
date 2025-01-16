require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const userRouter = require("./routes/authRoutes");
const bookRouter = require("./routes/bookRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const recommendationRouter = require("./routes/recommendationRoutes")

app.use("/api/auth", userRouter);
app.use("/api/book", bookRouter);
app.use("/api/review", reviewRouter);
app.use("/api", recommendationRouter);

//mongo db CONNECTION
mongoose
    .connect('mongodb://localhost:27017/book_sharing')

    .then(() => {
        console.log("connect to mongooseDB")
    })
    .catch(() => {
        console.error("connection error",);
    });

//Routes


app.listen(5000, () => {
    console.log(`The server is running on port 5000`);

});