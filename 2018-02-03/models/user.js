var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var UserSchema =    mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    passport:{
        type:String
    },
    email:{
        type:String
    }

});


var User= module.exports=mongoose.model('User',UserSchema);
module.exports.createUser =function(newUser,callback){
   
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.passport, salt, function(err, hash) {
           newUser.passport=hash;
           newUser.save(callback);
        });
    });
}

