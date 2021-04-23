var mongoose = require("mongoose");

// MONGOOSE CONFIG
var eventSchema = new mongoose.Schema({
    name: String,
    place: String,
    address: String,
    logo: String,
    coordinators: String,
    desc: String,
    date: Date,
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

module.exports = mongoose.model("Event", eventSchema);
