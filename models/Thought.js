const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema (
    {
        toughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => createdAtVal.toISOString().split('T')[0], // Formats the date to YYYY-MM-DD
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

//Insert virtual here

const Thought = model ('Thought', thoughtSchema);

module.exports = Thought;