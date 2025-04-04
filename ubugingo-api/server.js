const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const compression = require('compression');

// Load environment variables first
dotenv.config();

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
}

// Routes
const audioRoutes = require('./routes/audio');

// Add caching
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with better error handling
mongoose.set('strictQuery', false); // Add this line to handle deprecation warning
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    // Start the server only after MongoDB connection is established
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Enhanced CORS configuration
app.use(cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 86400 // Cache preflight requests for 24 hours
}));

// Add compression for faster responses
app.use(compression());

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Mount routes
app.use('/api/audio', audioRoutes);

// Add request timeout middleware
app.use((req, res, next) => {
    res.setTimeout(10000, () => {
        res.status(408).send('Request Timeout');
    });
    next();
});

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads/books'));
    },
    filename: function (req, file, cb) {
        // Get the book name from the request body or params
        const bookName = req.body.book_name || req.params.bookName || 'unknown';
        // Create a clean filename from the book name
        const cleanBookName = bookName.toLowerCase().replace(/\s+/g, '-');
        // Add the extension from the original file
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${cleanBookName}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Book Schema
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

// Migration endpoint to fix testament field
app.post('/api/migrate-testament-field', async (req, res) => {
    try {
        // Find all books with old 'testament' field
        const booksToUpdate = await Book.find({ testament: { $exists: true } });

        // Update each book
        for (const book of booksToUpdate) {
            await Book.updateOne(
                { _id: book._id },
                {
                    $set: { book_testament: book.testament },
                    $unset: { testament: "" }
                }
            );
        }

        res.json({
            message: 'Testament field migration completed',
            updatedCount: booksToUpdate.length
        });
    } catch (error) {
        console.error("Error in migration:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Migration endpoint to fix numeric testament values
app.post('/api/migrate-testament-to-string', async (req, res) => {
    try {
        // Find all books with numeric testament values
        const books = await Book.find({});
        let updatedCount = 0;

        for (const book of books) {
            let newTestament = book.book_testament;

            // Convert numeric values to strings
            if (typeof book.book_testament === 'number') {
                if (book.book_testament === 0) {
                    newTestament = 'Isezerano Rya Kera';
                } else if (book.book_testament === 1) {
                    newTestament = 'Isezerano Rishya';
                }

                await Book.updateOne(
                    { _id: book._id },
                    { $set: { book_testament: newTestament } }
                );
                updatedCount++;
            }
        }

        res.json({
            message: 'Testament values migrated to strings',
            updatedCount: updatedCount
        });
    } catch (error) {
        console.error("Error in migration:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running correctly' });
});

// Update the books endpoint with more detailed logging
app.get('/api/books/:testament', async (req, res) => {
    try {
        const testament = decodeURIComponent(req.params.testament);
        console.log('Fetching books for testament:', testament);

        // Check cache first
        const cacheKey = `books_${testament}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log('Returning cached data for:', testament);
            return res.json(cachedData);
        }

        // Convert testament string to number
        let testamentValue;
        const testamentLower = testament.toLowerCase().trim();

        console.log('Normalized testament name:', testamentLower);

        // Handle both string names and numeric values
        if (testamentLower === 'isezerano rya kera' || testament === '0') {
            testamentValue = 0;
            console.log('Using testament value 0 (Isezerano Rya Kera)');
        } else if (testamentLower === 'isezerano rishya' || testament === '1') {
            testamentValue = 1;
            console.log('Using testament value 1 (Isezerano Rishya)');
        } else {
            // Default to Isezerano Rya Kera
            testamentValue = 0;
            console.log('Unknown testament name, defaulting to 0 (Isezerano Rya Kera)');
        }

        console.log('Querying database with testament value:', testamentValue);
        const books = await Book.find({ book_testament: testamentValue });
        console.log(`Found ${books.length} books for testament ${testamentValue}`);

        if (!books || books.length === 0) {
            console.log('No books found for testament:', testamentValue);
            return res.json([]); // Return empty array instead of error
        }

        // Process books and add full URLs
        const processedBooks = books.map(book => ({
            ...book.toObject(),
            book_cover: book.book_cover ? `${req.protocol}://${req.get('host')}/uploads/books/${book.book_cover}` : null
        }));

        // Cache the results
        cache.set(cacheKey, processedBooks);

        res.json(processedBooks);
    } catch (error) {
        console.error('Error in /api/books/:testament:', error);
        res.status(500).json({
            error: 'Failed to fetch books',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Upload book cover
app.post('/api/books/:bookId/cover', upload.single('cover'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const bookId = req.params.bookId;
        const book = await Book.findOne({ book_id: bookId });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Store just the filename
        const filename = req.file.filename;

        const updatedBook = await Book.findOneAndUpdate(
            { book_id: bookId },
            { book_cover: filename },
            { new: true }
        );

        // Add the full URL for the response
        const bookWithUrl = updatedBook.toObject();
        bookWithUrl.book_cover = `${req.protocol}://${req.get('host')}/uploads/books/${filename}`;

        res.json({
            message: 'Cover uploaded successfully',
            book: bookWithUrl
        });
    } catch (error) {
        console.error("Error uploading cover:", error);
        res.status(500).json({ error: error.message });
    }
});

// Upload book image
app.post('/api/books/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imagePath = '/uploads/books/' + req.file.filename;

        res.json({
            message: 'Image uploaded successfully',
            image_url: `${req.protocol}://${req.get('host')}${imagePath}`,
            path: imagePath
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: error.message });
    }
});

// Create new book with image
app.post('/api/books', async (req, res) => {
    try {
        const bookData = {
            _id: new mongoose.Types.ObjectId(),
            book_id: req.body.book_id,
            book_name: req.body.book_name,
            book_description: req.body.book_description,
            book_cover: req.body.book_cover, // Store just the filename
            total_chapters: req.body.total_chapters,
            book_testament: req.body.book_testament
        };

        const book = new Book(bookData);
        await book.save();

        // Add the full URL for the response
        const bookWithUrl = book.toObject();
        bookWithUrl.book_cover = `${req.protocol}://${req.get('host')}/uploads/books/${book.book_cover}`;

        res.status(201).json({
            message: 'Book created successfully',
            book: bookWithUrl
        });
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ error: error.message });
    }
});

// Fix duplicate book IDs
app.post('/api/fix-duplicate-book-ids', async (req, res) => {
    try {
        // Get all books sorted by book_id
        const books = await Book.find().sort({ book_id: 1 });

        // Keep track of used book_ids
        const usedIds = new Set();
        let nextId = 1;

        // Update books with unique IDs
        for (const book of books) {
            if (usedIds.has(book.book_id)) {
                // Find next available ID
                while (usedIds.has(nextId)) {
                    nextId++;
                }

                // Update book with new ID
                await Book.updateOne(
                    { _id: book._id },
                    { book_id: nextId }
                );
                usedIds.add(nextId);
            } else {
                usedIds.add(book.book_id);
            }
        }

        res.json({
            message: 'Duplicate book IDs fixed',
            totalBooks: books.length
        });
    } catch (error) {
        console.error("Error fixing book IDs:", error.message);
        res.status(500).json({ error: error.message });
    }
});