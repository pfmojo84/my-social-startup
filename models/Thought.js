const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema (
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => {
                const datePart = createdAtVal.toISOString().split('T')[0];
                const timePart = createdAtVal.toISOString().split('T')[1].slice(0, 5);
                return `${datePart} ${timePart}`;
            }
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

//Virutal to retrieve length of the thought's reactions array field
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model ('Thought', thoughtSchema);

module.exports = Thought;