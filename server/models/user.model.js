import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, {
    timestamps: true
})

userSchema.pre('find', function (next) {
    this.populate('likedPosts'); // Populate the 'likedPosts' field
    next();
})

const User = mongoose.model('User', userSchema)

export default User