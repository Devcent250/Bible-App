const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ubugingo';

const bookSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    book_id: Number,
    book_name: String,
    book_description: String,
    book_cover: String,
    total_chapters: Number,
    book_testament: String
});

const Book = mongoose.model('Book', bookSchema, 'book');

// Book data with image file names
const booksData = [

    {
        book_id: 3,
        book_name: "Abalewi",
        book_description: "Igitabo cy'Abalewi kigaragaza amategeko y'Imana ku bana ba Isirayeli",
        imageFile: "abalewi.jpg",
        total_chapters: 27,
        book_testament: "Isezerano Rya Kera"
    },
    {
        book_id: 4,
        book_name: "Kubara",
        book_description: "Igitabo cya Kubara kigaragaza umubare w'Abisirayeli",
        imageFile: "kubara.jpg",
        total_chapters: 36,
        book_testament: "Isezerano Rya Kera"
    },
    {
        book_id: 5,
        book_name: "Guteka",
        book_description: "Igitabo cya Guteka kigaragaza amategeko ya Mose",
        imageFile: "guteka.jpg",
        total_chapters: 34,
        book_testament: "Isezerano Rya Kera"
    }
];

async function copyImage(imageFile) {
    const sourcePath = path.join(__dirname, 'book-images', imageFile);
    const destPath = path.join(__dirname, 'public', 'uploads', 'books', imageFile);

    // Create directories if they don't exist
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // Copy the image if it exists
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        return `/uploads/books/${imageFile}`;
    } else {
        console.warn(`Warning: Image file ${imageFile} not found in book-images directory`);
        return null;
    }
}

async function populateBooks() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Clear existing books
        await Book.deleteMany({});
        console.log('Cleared existing books');

        // Process each book
        const booksToInsert = await Promise.all(booksData.map(async (bookData) => {
            const imagePath = await copyImage(bookData.imageFile);
            return {
                _id: new mongoose.Types.ObjectId(),
                ...bookData,
                book_cover: imagePath,
            };
        }));

        // Insert books
        await Book.insertMany(booksToInsert);
        console.log('Books populated successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error populating books:', error);
        process.exit(1);
    }
}

populateBooks(); 