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
    testament: String
});

const Book = mongoose.model('Book', bookSchema, 'book');

async function fixBooks() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB\n');

        // Step 1: Fix testament fields
        const booksToUpdate = await Book.find({
            $or: [
                { testament: { $exists: true } },
                { book_testament: { $exists: false } }
            ]
        });

        for (const book of booksToUpdate) {
            const correctTestament = book.testament || book.book_testament;
            if (correctTestament) {
                await Book.updateOne(
                    { _id: book._id },
                    {
                        $set: { book_testament: correctTestament },
                        $unset: { testament: "" }
                    }
                );
                console.log(`Updated testament for ${book.book_name}`);
            }
        }

        // Step 2: Ensure all books have the correct testament value
        const allBooks = await Book.find();
        for (const book of allBooks) {
            if (!book.book_testament) {
                // Set default testament based on book name or other logic
                const testament = "Isezerano Rya Kera"; // Default value
                await Book.updateOne(
                    { _id: book._id },
                    { $set: { book_testament: testament } }
                );
                console.log(`Set default testament for ${book.book_name}`);
            }
        }

        // Step 3: Verify results
        console.log('\nVerifying results:');

        const keraBooks = await Book.find({ book_testament: "Isezerano Rya Kera" });
        console.log('\nIsezerano Rya Kera books:');
        keraBooks.forEach(book => {
            console.log(`- ${book.book_name} (ID: ${book.book_id})`);
        });

        const rishyaBooks = await Book.find({ book_testament: "Isezerano Rishya" });
        console.log('\nIsezerano Rishya books:');
        rishyaBooks.forEach(book => {
            console.log(`- ${book.book_name} (ID: ${book.book_id})`);
        });

        console.log('\nFix completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixBooks(); 