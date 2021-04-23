var mongoose = require("mongoose");

// MONGOOSE CONFIG
var contactSchema = new mongoose.Schema({
    email: String,
    created: {
                type: Date, 
                default: Date.now
            },
});

module.exports = mongoose.model("Contact", contactSchema);
