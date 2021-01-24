const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
    {
        id: String,
        title: String,
        startDate: String,
        endDate: String,
        description: String
    },

)

var PostMessage = mongoose.model('PostMessage', postSchema)

module.exports = PostMessage