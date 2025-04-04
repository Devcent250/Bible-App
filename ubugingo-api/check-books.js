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

async function checkBooks() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB\n');

        // Check all books
        const allBooks = await Book.find({});
        console.log('Total books in database:', allBooks.length);
        console.log('\nAll books in collection:');
        allBooks.forEach(book => {
            console.log(`\nBook: ${book.book_name}`);
            console.log(`ID: ${book.book_id}`);
            console.log(`Testament: ${book.book_testament}`);
            console.log('-------------------');
        });

        // Check books by testament
        console.log('\nBooks with testament=0 (Isezerano Rya Kera):');
        const keraBooks = await Book.find({ book_testament: 0 });
        console.log(`Found ${keraBooks.length} books`);
        keraBooks.forEach(book => console.log(`- ${book.book_name}`));

        console.log('\nBooks with testament=1 (Isezerano Rishya):');
        const rishyaBooks = await Book.find({ book_testament: 1 });
        console.log(`Found ${rishyaBooks.length} books`);
        rishyaBooks.forEach(book => console.log(`- ${book.book_name}`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkBooks(); 