
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String, 
        required: true,
        minlength: 5,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    emailActive: {
        type: Boolean,
        default: false
    }

},{timestamps:true});




const User = mongoose.model("User", UserSchema);


module.exports = User