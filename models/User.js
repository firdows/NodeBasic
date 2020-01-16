
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/NodeJsDB';
var bcrypt = require('bcryptjs');

mongoose.connect(mongoDB,{
    useNewUrlParser:true
});

var db=mongoose.connection;
db.on('error',console.error.bind(console,"MongoDB Connect Error"));

// Create Schema
var userSchema = mongoose.Schema({
    email:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    },
    first_name:{
        type:String
    },
    last_name:{
        type:String
    },
});

var User=module.exports=mongoose.model('User',userSchema);

module.exports.createUser=function(newUser,callback){

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.password = hash;
            newUser.save(callback);
        });
    });    
}

module.exports.getUserById=function(id,callback){
   User.findById(id,callback);
}

module.exports.getUserByName=function(username,callback){
    var query={
        username:username
    };
    User.findOne(query,callback);
 }


