const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ubugingo';


const bookSchema = new mongoose.Schema({
    book_id: Number,
    book_name: String,
    book_description: String,
    book_cover: String,
    total_chapters: Number,
    testament: String,
});


const Book = mongoose.model('Book', bookSchema, 'book');

mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

app.get('/api/books/:testament', async (req, res) => {
    try {
        const testament = req.params.testament;
        const books = await Book.find({ testament: testament });
        res.json(books);
    } catch (error) {
        console.error("Error in /api/books:", error.message);
        res.status(500).json({ error: error.message });
    }
});