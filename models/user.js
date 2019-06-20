const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        
    },
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    try {
        const user = this;

        if (!user.isModified('password')) return next();

        user.password = await bcrypt.hash(user.password, 10);
    } catch (ex) {
        console.log(`Erro na geração da hash: ${ex}`);
    } finally {
        return next();
    }
});

module.exports = mongoose.model('User', UserSchema);