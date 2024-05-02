//const { ObjectId } =  require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    //Get all users
    async getUsers(req, res) {
        try {
            const users = await User.find()
            .populate('thoughts');
            res.json(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    //Get a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
             .select('-__v').populate('thoughts').populate('friends')
      
            if (!user) {
              return res.status(404).json({ message: 'No user with that ID' })
            }
      
            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    //create a new user (post)
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete a user and associated thoughts
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and associated thoughts deleted!' })

        } catch (err) {
            res.status(500).json(err);
        }
    },
    //update a user by id (put)
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if(!user) {
                return res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    //add friend to a user's friend list
    async addFriend(req, res) {
        console.log('You are adding a friend');
        console.log(req.body);

        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if(!user) {
                return res.status(404).json({ message: 'No user found with that Id!' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //remove friend from a user's friend list
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if(!user) {
                return res.status(404).json({ message: 'No user found with that id! '});
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};