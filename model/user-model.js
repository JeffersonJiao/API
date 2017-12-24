const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
const userSchema = new Schema({
    username: String,
    googleId: String,
    highestScore: Number,
    email: String,
    password: String
});

const User = mongoose.model('user',userSchema);

module.exports = User;


module.exports.createUser = (newUser,callback)=>{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback)
        });
    });
}

module.exports.getUserByEmail = (email,callback)=>{
    var query = {email: email};
    User.findOne(query,callback);
}

module.exports.getUserById = (id,callback)=>{
    User.findById(id,callback);
}

module.exports.comparePassword = (candidatePassword,hash,callback)=>{
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null,isMatch);
    });
}