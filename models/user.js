var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema

//set create usernmae model formate
var UserSchema = new Schema({
    username:{
        type:String,
        index:true
    },
    password:{
        type:String
    },
    email:{
        type:String
    },
    identity:{
        type:String
    }
    

});

//export as a mongoose model
var User= module.exports=mongoose.model('User',UserSchema);


module.exports.createUser =function(newUser,callback){
   //hash the password
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
           newUser.password=hash;
           newUser.save(callback);
        });
    });
}

module.exports.getUserByUserName = function(username,callback){
    var query = {username:username};
    User.findOne(query,callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

