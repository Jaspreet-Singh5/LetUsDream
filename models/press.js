var mongoose = require("mongoose");

// MONGOOSE CONFIG
var pressSchema = new mongoose.Schema({
    title: String,
    image: String,
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

module.exports = mongoose.model("Press", pressSchema);
