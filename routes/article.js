var express = require('express');
var router = express.Router();

var passport = require('passport');

var Post = require('../models/post')



router.get('/',function(req,res){
	
	


	var nowPage = req.query.page||1;
	
	var db_limit =parseInt(nowPage)*4
	var db_skip = (parseInt(nowPage)-1)*4
	// 4,0  8,4  12,8
	if(nowPage <3){
		nowPage=3;
	}
	var back2Page = parseInt(nowPage)-2;
	var backPage = parseInt(nowPage)-1;
	var nextPage = parseInt(nowPage)+1;
	var next2Page = parseInt(nowPage)+2;
	var next3Page = parseInt(nowPage)+3;
	

	
	Post.getPost(db_limit,db_skip,function(err,docs){
		
	
		res.render('article',{data:docs,
							nowPage:nowPage,
							back2Page:back2Page,
							backPage:backPage,
							nextPage:nextPage,
							next2Page:next2Page,
							next3Page:next3Page})
	})
	
	



})



router.get('/post/:id',function(req,res){
	var article_id=req.params.id
	Post.getPostById(article_id,function(err,docs){

		res.render('articleContent',{
			data:docs
		})
		console.log(typeof docs)
	})

})


// render editor
router.get('/posteditor',function(req,res){
	res.render('posteditor')
	
	
})




router.post('/posteditor',function(req,res){
	var title = req.body.title;
	var data = req.body.data;
	


	console.log(data)
	console.log(title)

	if(data!==''&&title!==''){

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		
		var yyyy = today.getFullYear();
		if(dd<10){
			dd='0'+dd;
		} 
		if(mm<10){
			mm='0'+mm;
		} 
		var today = dd+'/'+mm+'/'+yyyy;


		var	newPost = new Post({
			user:req.session.passport.user,
			title:title,
			content:data,
			postDate:today

			
		})

		Post.createPost(newPost)
		console.log('new post created')
	}else{
		console.log('post failed')
	}
	res.send('ok')
})




module.exports = router;