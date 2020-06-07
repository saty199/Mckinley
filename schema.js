const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Mixed = mongoose.Schema.Types.Mixed;

const UserSchema = new Schema({
    email: { type: String, trim: true, unique: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    contactNo: { type: String, trim: true },
    password: { type: String, trim: true },
    createdAt: { type: Date, default: new Date().toDateString() },
}, { strict: false })

module.exports = mongoose.model('User', UserSchema)