const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ubugingo';

const bookSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    book_id: Number,
    book_name: String,
    book_description: String,
    book_cover: String,
    total_chapters: Number,
    book_testament: Number
});

const Book = mongoose.model('Book', bookSchema, 'book');

const testBooks = [
    {
        book_id: 1,
        book_name: "Itangiriro",
        book_description: "Igitabo cya mbere cya Bibiliya",
        book_cover: "itangiriro.jpg",
        total_chapters: 50,
        book_testament: 0  // Isezerano Rya Kera
    },
    {
        book_id: 2,
        book_name: "Kuva",
        book_description: "Igitabo cya kabiri cya Bibiliya",
        book_cover: "kuva.jpg",
        total_chapters: 40,
        book_testament: 0  // Isezerano Rya Kera
    },
    {
        book_id: 3,
        book_name: "Matayo",
        book_description: "Ubutumwa bwiza bwa Yesu Kristo",
        book_cover: "matayo.jpg",
        total_chapters: 28,
        book_testament: 1  // Isezerano Rishya
    },
    {
        book_id: 4,
        book_name: "Mariko",
        book_description: "Ubutumwa bwiza bwa Yesu Kristo",
        book_cover: "mariko.jpg",
        total_chapters: 16,
        book_testament: 1  // Isezerano Rishya
    }
];

async function populateTestBooks() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // First, let's see what's in the database
        const existingBooks = await Book.find({});
        console.log(`Found ${existingBooks.length} existing books`);

        // Add our test books
        for (const bookData of testBooks) {
            const existingBook = await Book.findOne({ book_id: bookData.book_id });

            if (!existingBook) {
                const book = new Book({
                    _id: new mongoose.Types.ObjectId(),
                    ...bookData
                });
                await book.save();
                console.log(`Added new book: ${bookData.book_name}`);
            } else {
                console.log(`Book ${bookData.book_name} already exists`);
            }
        }

        // Verify the books are in the database
        const allBooks = await Book.find({});
        console.log('\nAll books in database:');
        allBooks.forEach(book => {
            console.log(`${book.book_name} (Testament: ${book.book_testament})`);
        });

        console.log('\nPopulation completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

populateTestBooks(); 