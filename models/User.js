const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: [true, 'Please provide username'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String, 
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid name'
        ],
        unique: true,
    },
    password: {
        type: String, 
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    createdAt: {
        type: Date, 
        default: Date.now,
    },
    //optional for future user
    // isAdmin: {
    //     type: Boolean, 
    //     default: false,
    // },
})

UserSchema.pre('save', async function() {
    // if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

// UserSchema.methods.createJWT = function () {
//     return jwt.sign({ userId: this._id, username: this.username }, 
//         process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_LIFETIME,
//     })
// }
UserSchema.methods.comparePassword = async function (candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}
module.exports = mongoose.model('User', UserSchema)
