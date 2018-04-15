var express = require('express');
var router = express.Router();




router.get('/',function(req,res){
    var username=''
    if(req.user){
		username=req.user.username
	}


   
    
    res.render('chatroom',{
        username:username
    });
})




module.exports = router