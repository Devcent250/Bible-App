const { MongoClient } = require('mongodb');

async function handler(req, res) {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('ubugingo');
        const collection = database.collection('book');

        const videos = await collection.find({}).toArray();

        // Transform the data to match our app's structure
        const transformedData = videos.map(video => ({
            id: video._id,
            name: video.book_name,
            chapters: video.total_chapters || 0,
            testament: video.book_testament,
            cover: video.book_cover
        }));

        res.status(200).json(transformedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    } finally {
        await client.close();
    }
}

module.exports = handler; 