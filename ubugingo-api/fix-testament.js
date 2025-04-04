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
    book_testament: String
});

const Book = mongoose.model('Book', bookSchema, 'book');

const keraBooks = ['Kuva', 'Yobu'];
const rishyaBooks = ['Mariko', 'Yohana'];

async function fixTestaments() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Update Isezerano Rya Kera books
        const keraResult = await Book.updateMany(
            { book_name: { $in: keraBooks } },
            { $set: { book_testament: 'Isezerano Rya Kera' } }
        );
        console.log('Updated Kera books:', keraResult);

        // Update Isezerano Rishya books
        const rishyaResult = await Book.updateMany(
            { book_name: { $in: rishyaBooks } },
            { $set: { book_testament: 'Isezerano Rishya' } }
        );
        console.log('Updated Rishya books:', rishyaResult);

        // Verify the updates
        const keraVerify = await Book.find({ book_testament: 'Isezerano Rya Kera' });
        console.log('\nBooks in Isezerano Rya Kera:');
        keraVerify.forEach(book => console.log(`- ${book.book_name} (ID: ${book.book_id})`));

        const rishyaVerify = await Book.find({ book_testament: 'Isezerano Rishya' });
        console.log('\nBooks in Isezerano Rishya:');
        rishyaVerify.forEach(book => console.log(`- ${book.book_name} (ID: ${book.book_id})`));

        console.log('\nFix completed successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

fixTestaments(); 