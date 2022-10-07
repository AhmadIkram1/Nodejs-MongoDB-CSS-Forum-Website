const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    firstname: {
      type: String,
      required: [true, 'Please enter First Name'],
    },
    lastname: {
      type: String,
      required: [true, 'Please enter Last Name'],
      },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email']
      },
    password: {
      type: String,
      required: [true, 'Please enter a password']
     // minlength: [6, 'Minimum password length is 6 characters']
      },
    passwordconf: {
      type: String
      //minlength: [6, 'Minimum password length is 6 characters']
    },
    isValid: {
      type: Boolean
    },
    uniqueString: {
      type: String
    }
});

// fire a function after doc saved to db
/*userSchema.post('save', function (doc, next) {
  console.log('new user was created & saved', doc);
  next();
});
*/
// fire a function before doc saved to db
/*userSchema.pre('save', async function(next) {
  
  //const salt =  await bcrypt.genSalt();
  this.password = await bcrypt.hashSync(this.password, 5);
  next();
  
});*/

// static method to login user
userSchema.statics.signin = async function(email, password) {

  const user = await this.findOne({ email });
  if (user) {
    console.log(user);
    if(user.isValid){
      
    /*var auth = await bcrypt.compare(password, user.password);
    console.log(auth);*/
    console.log(password);
    console.log(user.password);
    /*console.log( bcrypt.compare(password, user.password,function(err,res)
    {
      if(err)
      {
        console.log(err);
      }
      else
      {
        console.log(res);
      }  
    }));*/
   
    if ( await bcrypt.compare(password, user.password) ) {
     
      return user;
    }
    throw new Error('incorrect password');
  }
  throw new Error('email not verified');
  }
  throw new Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;