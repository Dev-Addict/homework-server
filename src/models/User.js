const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A User Must Have a name']
    },
    username: {
        type: String,
        required: [true, 'A User Must Have a username']
    },
    rote: {
        type: String,
        enum: {
            values: ['admin', 'school-manager', 'student', 'teacher'],
            message: 'Invalid User'
        },
        default: 'student'
    },
    password: {
        type: String,
        required: [true, 'A User Must Have A password'],
        minLength: 8,
        maxLength: 100,
        select: false
    },
    manager: {
        type: mongoose.Schema.ObjectId,
        default: User.findOne({rote: 'admin'})['_id']
    }
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;