const express = require('express');
const router = express.Router();
const Audio = require('../models/Audio');

// Helper function to extract video ID from YouTube URL
const extractVideoId = (url) => {
    if (!url) return null;
    // Handle both full URLs and direct video IDs
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

// Get all videos
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all audio entries');
        const allAudio = await Audio.find().sort({ book: 1, chapter: 1 });
        
        if (!allAudio || allAudio.length === 0) {
            console.log('No audio entries found');
            return res.status(404).json({ message: 'No audio entries found' });
        }

        // Process each audio to ensure video IDs are properly formatted
        const processedAudio = allAudio.map(audio => ({
            ...audio.toObject(),
            videoId: extractVideoId(audio.url)
        }));

        console.log(`Found ${processedAudio.length} audio entries`);
        return res.json(processedAudio);
    } catch (error) {
        console.error('Error fetching all audio:', error);
        return res.status(500).json({ message: 'Error fetching audio entries' });
    }
});

// Get all chapters for a book
router.get('/:book', async (req, res) => {
    try {
        const { book } = req.params;
        console.log(`Fetching all audio chapters for ${book}`);

        const audioChapters = await Audio.find({ book }).sort({ chapter: 1 });
        if (!audioChapters || audioChapters.length === 0) {
            console.log('No audio chapters found');
            return res.status(404).json({ message: 'No audio chapters found' });
        }

        // Process each audio to ensure video IDs are properly formatted
        const processedChapters = audioChapters.map(audio => ({
            ...audio.toObject(),
            videoId: extractVideoId(audio.url)
        }));

        console.log(`Found ${processedChapters.length} chapters`);
        return res.json(processedChapters);
    } catch (error) {
        console.error('Error fetching audio chapters:', error);
        return res.status(500).json({ message: 'Error fetching audio chapters' });
    }
});

// Get specific chapter audio
router.get('/:book/:chapter', async (req, res) => {
    try {
        const { book, chapter } = req.params;
        console.log(`Fetching audio for ${book} chapter ${chapter}`);

        const audio = await Audio.findOne({ book, chapter: parseInt(chapter) });
        if (!audio) {
            console.log('Audio not found');
            return res.status(404).json({ message: 'Audio not found' });
        }

        // Process audio to ensure video ID is properly formatted
        const processedAudio = {
            ...audio.toObject(),
            videoId: extractVideoId(audio.url)
        };

        console.log('Found audio:', processedAudio);
        return res.json(processedAudio);
    } catch (error) {
        console.error('Error fetching audio:', error);
        if (!res.headersSent) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: 'Invalid data format',
                    details: error.message
                });
            }
            return res.status(500).json({ message: 'Error fetching audio' });
        }
    }
});

// Get specific chapter
router.get('/:book/:chapter', async (req, res) => {
    try {
        const { book, chapter } = req.params;
        console.log(`Fetching ${book} chapter ${chapter}`);
        
        const audio = await Audio.findOne({ 
            book: book,
            chapter: parseInt(chapter)
        });

        if (!audio) {
            console.log(`No audio found for ${book} chapter ${chapter}`);
            return res.status(404).json({ message: 'Audio not found' });
        }

        const processedAudio = {
            ...audio.toObject(),
            videoId: extractVideoId(audio.url)
        };

        console.log('Found audio:', processedAudio);
        res.json(processedAudio);
    } catch (error) {
        console.error('Error fetching audio:', error);
        res.status(500).json({ message: 'Error fetching audio', error: error.message });
    }
});

module.exports = router;