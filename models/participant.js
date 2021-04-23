var mongoose = require("mongoose");

// MONGOOSE CONFIG
var participantSchema = new mongoose.Schema({
    email: String,
    fName: String,
    lName: String,
    dob: Date,
    gender: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zip: Number,
    grade: String,
    locat: String,
    pName: String,
    mNum: String,
    tphNum: String,
    eName: String,
    eMNum: String,
    eTphNum: String,
    created: {
                type: Date, 
                default: Date.now
            },
});

module.exports = mongoose.model("Participant", participantSchema);
