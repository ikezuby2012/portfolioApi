const mongoose = require("mongoose");
const validator = require("validator");

const { Schema, model } = mongoose;

const messageSchema = new Schema({
    name: {
        type: String,
        required: [true, "user must have a name!"]
    },
    email: {
        type: String,
        lowerCase: true,
        // unique: true,
        validate: [validator.isEmail, "please provide a valid email address"],
        required: [true, "user must have an email"]
    },
    message: {
        type: String,
        minLength: [10, "message length must be longer than ten"],
        required: [true, "user must have a message!"]
    },
    from: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Message = model("Message", messageSchema);
module.exports = Message;