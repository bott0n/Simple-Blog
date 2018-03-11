var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:qq7895123@loginapp-shard-00-00-oa7mk.mongodb.net:27017,loginapp-shard-00-01-oa7mk.mongodb.net:27017,loginapp-shard-00-02-oa7mk.mongodb.net:27017/test?ssl=true&replicaSet=loginapp-shard-0&authSource=admin')
//mongoose.connect('mongodb://localhost/loginapp')
var db = mongoose.connection;


var routes = require('./routes/index');
var users = require('./routes/users');
var article = require('./routes/article');

// init app 
var app=express();

//view engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}))
app.set('view engine','handlebars');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

//set static folder
app.use(express.static(path.join(__dirname,'public')))

//express station
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}))

//passport init
app.use(passport.initialize());
app.use(passport.session());


//express validator
app.use(expressValidator({
    errorFormatter:function(param,msg,value){
        var namespace = param.split('.')
        ,root =namespace.shift()
        ,formParam = root;


        while(namespace.length){
            formParam+='['+namespace.shift()+']';

        }
        return {
            param:formParam,
            msg:msg,
            value:value
        }

    },
   
}))

//connect flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//set routerrouter
app.use('/',routes);
app.use('/index',routes);
app.use('/users',users);
app.use('/article',article);

//set 404 page
app.use(function(req, res, next){
    res.status(404);
  
    res.render('404')


});

//set port
app.set('port', (process.env.PORT||3000));

app.listen(app.get('port'),function(){
    console.log('server started at '+app.get('port'))
})




