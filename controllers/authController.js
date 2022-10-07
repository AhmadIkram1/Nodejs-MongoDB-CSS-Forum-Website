
// controller actions
const mongoose = require('mongoose');

var Schema = mongoose.Types;
var ObjectId = Schema.ObjectId;
 const User = require("../models/User"); 
 const Post = require("../models/Post");
 const Comment = require("../models/Comments");
 const jwt = require('jsonwebtoken');
 const bcrypt = require('bcrypt');
 const sendEmail = require('./mailController');
 const fsendEmail = require('./forgetMailController');
 
 // handle errors
 const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { firstname: '', lastname: '', email: '', password: '', passwordconf: '' , title: '', content: ''};

    // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  if(err.message === 'short password'){
    errors.password = 'Password should be atlest 6 characters long';
  }

  //unverified Email
  if(err.message === 'email not verified'){
    errors.email = 'That email is not verified';
  }
  
  if(err.message == 'Cannot read properties of undefined (reading "\'uniqueString\'")' ){
    errors.email = 'That email is not verified';
  }
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }

    if (err.message.includes('post validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }

    return errors;
  }

  // create json web token
  const maxAge = 3 * 24 * 60 * 60;
  const createToken = (id) => {
  return jwt.sign({ id }, 'cssweb secret', {
    expiresIn: maxAge
  });
 };

 //random string function
 const randString = () => {
   const len = 8;
   let randStr = '';
   for(let i=0; i<len; i++) {
     const ch = Math.floor((Math.random() * 10) +1 );
     randStr += ch;
   }
   return randStr;
 }

 /*const getRandomString = (length) => {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for ( var i = 0; i < length; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}
*/





  module.exports.home_get = (req, res) => {
      res.render('home');
  }
  module.exports.forum_get = (req, res) => {
    res.render('forum');
  }

  module.exports.signin_get = (req, res) => {
    res.render('signin');
    
  }
  
  module.exports.signin_post = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.signin(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }
  
  module.exports.signup_get = (req, res) => {

    res.render('signup');
  }

  module.exports.signup_post = async (req, res) => {
    const { firstname, lastname, email, password, passwordconf } = req.body;
    const isValid = false;
    const uniqueString = randString();
    try {
      if(password === passwordconf)
      {
      const user = await User.create({ firstname, lastname, email, password : bcrypt.hashSync(password,5)
        , isValid, uniqueString });
      //const token = createToken(user._id);
     // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
      sendEmail(email, uniqueString); 
      }
      else{
        console.log(' Password Mismatch');
        res.status(400)
      }
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
   
  }
 
  module.exports.signout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }
 
  module.exports.verifyGet = async (req, res) => {
    const { uniqueString } = req.params;
    console.log(uniqueString);
    const usera = await User.findOne({uniqueString})
    if(usera) {
      usera.isValid = true;
      const token = createToken(usera._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      await usera.save();
      console.log("user saved");
      res.redirect('/');
    }
    else{
      console.log("user not found");
    }
  }

  module.exports.changePassGet = async (req, res) => {
    const {uniqueString, cpass} = req.params;
    console.log(uniqueString, cpass);
    const usera = await User.findOne({uniqueString})
    if(usera) {
      usera.password = bcrypt.hashSync(cpass,5);
      console.log(usera.password);
      await usera.save();
      console.log("user saved");
      res.redirect('/signin');
    }
   
  }



  module.exports.forgetPassword_get = (req, res) => {
      res.render('forgetPassword');
  }

  

  module.exports.forgetPassword_post = async (req, res) => {

    const { email, password } = req.body;
    try {

    let uniqueString = null;
    
    const retrieve = () => {
      User.find({email})
      .then(repo => {
        if(repo.length != 0) {
        
        uniqueString = repo[0].uniqueString;
        console.log( repo + uniqueString )
        console.log(uniqueString);
        
        if(password.length > 5) {
          fsendEmail(email, password, uniqueString);
        }
        else{
          throw new Error('short password');
        }
      }
      else{
        throw new Error('incorrect email');
      }
      })
      .catch(err => {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
      })
    };

    retrieve();
    
    }
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }
  
  module.exports.contact_get = (req, res) => {
    res.render('contact');
  } 
   
  module.exports.forumTopics_get = async (req, res) => {
    const posts = await Post.find({}).lean();
    var answers = [];
    var postusername = [];
    for(var i=0; i<posts.length; i++){
      answers[i] = posts[i].comments.length;
      postusername[i] = await User.findById(posts[i].user);
    }
    res.render('forumTopics', {posts, answers, postusername});
  }

  module.exports.forumProfile_get = (req, res) => {
    res.render('forumProfile');
  }

  module.exports.createPost_get = (req, res) => {
    res.render('createPost');
  }

  module.exports.createPost_post = async (req, res) => {
    try{
      const { title, content, userid } = req.body;
     // console.log(userid);
      const post = await Post.create({ title, content, user: userid});
     // console.log(post);
      res.redirect(302, `/${post.id}`);
    }
    catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
  }

  module.exports.forumPost_get = async (req, res) => {
    try{
    const id = req.params.id;
    const post = await Post.findById(id);
    const postusername = await User.findById(post.user);
    var commentContent = [];
    var commentUsername = [];
    for(var i=0; i<post.comments.length; i++){
      console.log(post.comments[i]);
       commentContent[i] = await Comment.findById(post.comments[i]);
       commentUsername[i] = await User.findById(commentContent[i].user);
       console.log(commentContent[i].user);
    }
   console.log(commentUsername);
    res.render('forumsingle' ,{postusername, posttime: post.date, id: post.id ,title: post.title, text: post.content, comments: commentContent, commentUsername});
  }
  catch(err){
    console.log(err);
  res.status(400).json({ err });
  }
  }

  module.exports.forumPost_post = async (req, res) => {
   try{
    const id = req.params.id;
    const postRelated = await Post.findById(id);
    const { text, userid } = req.body;
    const comment = await Comment.create({ text, user: userid });
     postRelated.comments.push(comment);
     comment.post = postRelated;
    await postRelated.save();
    await comment.save();
      res.redirect(302, `/${id}`);
   }
   catch (err) {
     console.log(err);
    res.status(400).json({ err });
   }
  }