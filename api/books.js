const { MongoClient } = require('mongodb');

async function handler(req, res) {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('ubugingo');
        const collection = database.collection('book');

        const testament = req.query.testament;
        const query = testament ? { book_testament: testament } : {};

        const books = await collection.find(query).toArray();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    } finally {
        await client.close();
    }
}

module.exports = handler; 