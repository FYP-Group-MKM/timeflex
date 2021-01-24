const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
    {
        id: String,
        title: String,
        startDate: Date,
        endDate: Date,
        description: String
    },

)

var PostMessage = mongoose.model('PostMessage', postSchema)

module.exports = PostMessage