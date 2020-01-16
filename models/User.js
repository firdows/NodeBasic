
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/NodeJsDB';

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
    newUser.save(callback);
}
