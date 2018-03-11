var express = require('express');
var mongoose = require('mongoose');




var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

var router = express.Router();
var User = require('../models/user');



var date = new Date();

// render 
router.get('/register',function(req,res){
    res.render('register');
});

router.get('/login',function(req,res){
    res.render('login');
});


// register post
router.post('/register',function(req,res){
    //Post data
    var username =req.body.username;
    var email =req.body.email;
    var password =req.body.password;
    var password2 =req.body.password2;
    

    //check data
    req.checkBody('username','Username is required!').notEmpty();
    req.checkBody('email','Email is required!').notEmpty();  
    req.checkBody('password','password is required!').notEmpty();
    req.checkBody('password2','password is required!').notEmpty();
    req.checkBody('password2','password is not same!').equals(req.body.password);
    
    
    var errors = req.validationErrors();

    //check Username already registered
    User.find({username:username},function(err,user){
       //if yes
        if(user.length>=1){
            var error = {param: "inputEmail", msg: "Username already registered", value: username};
            if (!errors) {
                errors = [];
            }
            errors.push(error);
           // console.log(errors)
            if(errors){
               // console.log(errors)
               
               //render the error msg
                res.render('register',{
                    errors:errors
                })
              
            }
           
        }
        //if no
        else{
            
            // console.log('register success')
            // console.log('username:'+username);
            // console.log('email:'+email);
            // console.log('password:'+password);
            // console.log('password2:'+password2);

        //create a new user
            var newUser = new User({
                username:username,
                password:password,
                email:email ,
                identity:'member'
                
            })
    
            User.createUser(newUser,function(err,user){
                if(err){
                console.log(err);
                }   
                console.log(user);
            })
           
            res.redirect('/users/login');
        }

       })
    

});

passport.use(new LocalStrategy(
    function(username, password, done) {
        

        // check username 
        User.getUserByUserName(username,function(err,user){


            if(err) throw err;
            
            if(!user){
                return done(null,false,{message:'Unknown User'})
                
            }
            // if username is correct , check password is same as datebase
            User.comparePassword(password,user.password,function(err,isMatch){
            
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                    
                }
                else{
                    
                    return done(null,false,{message:'Wrong password'})
                
                    
                }
            })
      })

     
    }
  ));


  passport.serializeUser(function(user, done) {
      //save user to session
    done(null, user.username);
    
    console.log(user.username+' has login!'+'    '+date)
  });
  
  passport.deserializeUser(function(username, done) {
      
    User.getUserByUserName(username, function(err, user) {
        
      done(err, user);
    });
  });
  


//login post
router.post('/login',
            passport.authenticate('local',
                                 { successRedirect: '/',
                                 failureRedirect: '/users/login',
                                 failureFlash: true ,
                                 badRequestMessage: 'Please insert all blank'}
                                 
           ));

router.get('/logout', function(req, res){

   
    
   
    req.logout();
    res.redirect('/users/login');
    
    
    

   

   
});
module.exports = router;