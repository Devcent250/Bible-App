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
    book_testament: String,
    testament: String // old field
});

const Book = mongoose.model('Book', bookSchema, 'book');

async function runMigrations() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Step 1: Migrate testament field
        const booksToUpdate = await Book.find({ testament: { $exists: true } });
        console.log(`Found ${booksToUpdate.length} books with old testament field`);

        for (const book of booksToUpdate) {
            await Book.updateOne(
                { _id: book._id },
                {
                    $set: { book_testament: book.testament },
                    $unset: { testament: "" }
                }
            );
            console.log(`Updated testament field for book: ${book.book_name}`);
        }

        // Step 2: Fix duplicate book IDs
        const allBooks = await Book.find().sort({ book_id: 1 });
        console.log(`\nChecking ${allBooks.length} books for duplicate IDs`);

        const usedIds = new Set();
        let nextId = 1;

        for (const book of allBooks) {
            if (usedIds.has(book.book_id)) {
                while (usedIds.has(nextId)) {
                    nextId++;
                }
                await Book.updateOne(
                    { _id: book._id },
                    { book_id: nextId }
                );
                console.log(`Updated duplicate book_id for ${book.book_name} to ${nextId}`);
                usedIds.add(nextId);
            } else {
                usedIds.add(book.book_id);
            }
        }

        // Step 3: Verify results
        const verifyBooks = await Book.find({ book_testament: "Isezerano Rya Kera" });
        console.log('\nBooks in Isezerano Rya Kera after migration:');
        verifyBooks.forEach(book => {
            console.log(`- ${book.book_name} (ID: ${book.book_id})`);
        });

        console.log('\nMigration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
}

runMigrations(); 