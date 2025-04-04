const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    book: {
        type: String,
        required: true,
        trim: true
    },
    chapter: {
        type: Number,
        required: true,
        min: 1
    },
    verses: {
        type: Number,
        required: true,
        min: 1
    },
    url: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                // Allow both full YouTube URLs and video IDs
                return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)?[a-zA-Z0-9_-]{11}$/.test(v);
            },
            message: props => `${props.value} is not a valid YouTube URL or video ID!`
        }
    },
    length: {
        type: String,
        required: true,
        default: '0 min'
    }
}, {
    timestamps: true
});

// Compound index for book and chapter to ensure uniqueness
audioSchema.index({ book: 1, chapter: 1 }, { unique: true });

// Pre-save middleware to clean YouTube URLs
audioSchema.pre('save', function(next) {
    if (this.url) {
        // Extract video ID if it's a full URL
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = this.url.match(regex);
        if (match) {
            this.url = match[1]; // Store only the video ID
        }
    }
    next();
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
