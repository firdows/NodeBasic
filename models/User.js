var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/NodeJsDB';
var bcrypt = require('bcryptjs');

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB Connect Error"));

// Create Schema
var userSchema = mongoose.Schema({
    email: {
        type: String,
        ref: 'Email'
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
});

var User = module.exports = mongoose.model('users', userSchema);

module.exports.createUser = function (newUser, callback) {

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            // Store hash in your password DB.
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByName = function (username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
}

function comparePassword(password, hash, callback) {
    bcrypt.compare(password, hash, function (err, isMatch) {
        callback(null, isMatch);
    })
}

module.exports.comparePassword = comparePassword;

module.exports.changePassword = function (User, old_password, new_password, callback) {
    comparePassword(old_password, User.password, function (err, isMatch) {
        callback(null, isMatch);
    });
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(new_password, salt, function (err, hash) {
            // Store hash in your password DB.
            User.password = hash;
            User.save(callback);
        });
    });
}


