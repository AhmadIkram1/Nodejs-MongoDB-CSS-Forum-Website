const mongoose = require('mongoose');

        const commentSchema = new mongoose.Schema({
         text: {
              type: String,
             // trim: true,
              required: true
           },
        date: {
              type: Date,
              default: Date.now
           },
       // each comment can only relates to one blog, so it's not in array
        post: {
              type: 'ObjectId',
              ref: 'post'
           },
        user:{
            type: 'ObjectId',
            ref: 'user'
          }
         })

         const Comment = mongoose.model('comment', commentSchema);

         module.exports = Comment;