import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
})

postSchema.pre('find', function (next) {
    this.populate('user', 'id username');
    next();
});

const Post = mongoose.model('Post', postSchema)

export default Post