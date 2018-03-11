var mongoose = require('mongoose');

var Schema = mongoose.Schema

var PostSchema = new Schema({
    user:{
        type:String,
        index:true
    },
    title:{
        type:String
    },
    content:{
        type:String
    },
    postDate:{
        type:String
    }
});

var Post = module.exports = mongoose.model('Post',PostSchema);



module.exports.createPost = function(newPost){

    newPost.save();
}



module.exports.getPost = function(nowPage,skipNum,callback){
    Post.find({}).sort({'_id':-1}).limit(nowPage).skip(skipNum).exec(function(err, docs) { callback(err,docs)});
}

module.exports.getPostById = function(id,callback){
    Post.find({_id:id}).exec(function(err, docs) { callback(err,docs)});
}