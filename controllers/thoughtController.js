const { Thought, User } = require('../models');

module.exports = {

    //get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find()
            .populate('reactions');
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //get single thought by Id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
            //.select('-_V').populate('reactions');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that Id' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //create a new thought and push to associated users thoughts array field
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );

            if(!user) {
                return res.status(404).json({ message: 'Thought created, but found no user with that Id' })
            }
            res.json('Created the thought!');
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    //update a thought by id
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    //delete a thought by its id
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({
                _id: req.params.thoughtId });

                if(!thought) {
                    return res.status(404).json({ message: 'No application with this id!' });
                }

                const user = await User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                );

                if(!user) {
                    return res.status(404).json({ message: 'Thought deleted but no user with this id!' });
                }
                
                res.json({ message: 'Thought successfully deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //create a reaction stored in a single thoughts 'reactions' array field
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if(!thought) {
                return res.status(404).json({ message: 'No thought with this id' });
            }
            
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //pull and remove a reaction by the reactionId value
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { _id: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if(!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};