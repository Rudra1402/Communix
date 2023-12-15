import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment