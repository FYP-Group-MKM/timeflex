const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
    {
        id: String,
        title: String,
        allDay: Boolean,
        startDate: String,
        endDate: String,
        rRule: String,
        exDate: String,
        description: String,
    },

)

var PostMessage = mongoose.model('PostMessage', postSchema)

module.exports = PostMessage