const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.use('/public/', express.static('./public'));


mongoose.connect("mongodb+srv://swathiasok:swathi14@cluster0.ak60v.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {

  title: String,
  body: String,
  author: String,
  img: Buffer
 
 };

const Post = mongoose.model("Post",postSchema);

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){ 
    res.render("post", { title : post?.title, body : post?.body, author: post?.author, img: post?.img });
  });
});

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {posts});
 })
})

app.get("/posts", function(req,res)
{
  Post.find({}, function(err, posts){
    res.render("posts", {posts});
 })
})

app.post("/",function(req,res)
  {
    res.redirect("/posts");
  })
  
  app.get("/compose", function(req, res){
    res.render("compose");
  })

  app.post("/posts/:postId",function(req,res)
  {
    res.redirect("/");
  })

  app.post("/posts",function(req,res)
  {
    res.redirect("/");
  })

  app.post("/compose", function(req, res){
      const post = new Post({
        title : req.body.titleText,
        body : req.body.postText,
        author : req.body.authorName, 
        img : req.body.img
      });
      post.save(function(){
        res.redirect("/");
      });

  })
  


let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port, function(){
  console.log("Server is running on port 5000");
})