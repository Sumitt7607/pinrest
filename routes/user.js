const mongoose = require('mongoose');
const posts = require('./post');

mongoose.connect(`mongodb://127.0.0.1:27017/pinrest`)

const userSchema = new  mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullname:String,
  password: {
    type: String,
    required: true,
  },
  birthday:{
    type: Date,
    required: true,
    trim: true,
},
profilepic:{
  type:String,
  default:"default.jpg"
},
posts:[
  {
      type:mongoose.Schema.Types.ObjectId,
      ref:"post",
  }
]
});

module.exports = mongoose.model('User', userSchema);


