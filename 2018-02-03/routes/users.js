var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();
var User = require('../models/user');


router.get('/register',function(req,res){
    res.render('register');
});

router.get('/login',function(req,res){
    res.render('login');
});

router.post('/register',function(req,res){
    var username =req.body.username;
    var email =req.body.email;
    var passport =req.body.passport;
    var passport2 =req.body.passport2;
    
    req.checkBody('username','Username is required!').notEmpty();
    req.checkBody('email','Email is required!').notEmpty();  
    req.checkBody('passport','Passport is required!').notEmpty();
    req.checkBody('passport2','Passport is required!').notEmpty();
    req.checkBody('passport2','Passport is not same!').equals(req.body.passport);
    
    
    var errors = req.validationErrors();

    User.find({username:'admin'},function(err,user){
       
        if(user){
            var error = {param: "inputEmail", msg: "Email address already registered", value: username};
            if (!errors) {
                errors = [];
            }
            errors.push(error);
            console.log(errors)
            if(errors){
                console.log(errors)
                res.render('register',{
                    errors:errors
                })
              
            }
            else{
                
                // console.log('register success')
                // console.log('username:'+username);
                // console.log('email:'+email);
                // console.log('passport:'+passport);
                // console.log('passport2:'+passport2);
        
                var newUser = new User({
                    username:username,
                    passport:passport,
                    email:email
                })
        
                User.createUser(newUser,function(err,user){
                    if(err){
                    console.log(err);
                    }   
                    console.log(user);
                })
               
                res.redirect('/users/login');
            }
        }

       })
    

});





module.exports = router;