const express = require('express');
const router = express.Router();
const Audio = require('../models/Audio');

// Get all audio tracks for a book
router.get('/:book', async (req, res) => {
    try {
        const { book } = req.params;
        const audioTracks = await Audio.find({ book }).sort({ chapter: 1 });
        res.json(audioTracks);
    } catch (error) {
        console.error('Error fetching audio tracks:', error);
        res.status(500).json({ message: 'Error fetching audio tracks' });
    }
});

// Get specific chapter audio
router.get('/:book/:chapter', async (req, res) => {
    try {
        const { book, chapter } = req.params;
        const audio = await Audio.findOne({ book, chapter: parseInt(chapter) });
        if (!audio) {
            return res.status(404).json({ message: 'Audio not found' });
        }
        res.json(audio);
    } catch (error) {
        console.error('Error fetching audio:', error);
        res.status(500).json({ message: 'Error fetching audio' });
    }
});

module.exports = router; 