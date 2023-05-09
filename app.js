
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.set('view engine', 'ejs');
app.use('/public/', express.static('./public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://swathiasok14:swaash143@blog1.fdxanvv.mongodb.net/blogPostDB",{useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  author: String,
  image_url: String,
  body: String
}

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function(err, posts){
    res.render("home", {posts : posts.slice(-3)});
 })
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts", function (req, res) {
  Post.find({}, function(err, posts){
    res.render("posts", {posts : posts});
 })
});

app.post("/", function (req, res) {
  res.redirect("/posts");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.title,
    author: req.body.author,
    image_url: req.body.image,
    body: req.body.post
  });

  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){ 
    res.render("post", { title : post?.title, body : post?.body, author: post?.author, img: post?.image_url });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server is running!');
})
