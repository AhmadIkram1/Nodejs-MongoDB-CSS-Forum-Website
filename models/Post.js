const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
   title: {
     type: String,
    // trim: true,
      required: [true, 'Please enter Title'],
   },
   content: {
     type: String,
  //   trim: true,
     required: [true, 'Please enter Content'],
   },
   date: {
     type: Date,
     default: Date.now
    },
 // a blog post can have multiple comments, so it should be in a array.
 // all comments info should be kept in this array of this blog post.
  comments: [{
     type: 'ObjectId',
     ref: 'comment'
   }],
  user:{
     type: 'ObjectId',
     ref: 'user'
   }
   })


   const Post = mongoose.model('post', postSchema);

   module.exports = Post;