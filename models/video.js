var mongoose = require("mongoose");

// MONGOOSE CONFIG
var videoSchema = new mongoose.Schema({
    title: String,
    video: String,
    desc: String,
    created: {
                type: Date, 
                default: Date.now
            },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String()
    }
});

module.exports = mongoose.model("Video", videoSchema);
