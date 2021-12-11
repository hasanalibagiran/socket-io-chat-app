const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    message: {
        type: String,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Message = mongoose.model('messages',MessageSchema)
module.exports= Message