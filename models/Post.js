const mongoose = require('mongoose');
const Schema = mongoose.Schema


const PostSchema = new Schema({
user: {
  type: Schema.Types.ObjectId,
  ref:'user'
},
text: {
  type:String,
  required: true
},
name: {
  type:String,
},
avatar: {
  type:String,
  required:true
},
likes: [
  {
    user:{
      type:Schema.Types.ObjectId,
      ref:'user'
    }
  }
],
date:{
  type:String,
  required:true,
  default:Date.now
},
comments: [
  {
    user:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },
    text:{
      type:String,
      required:true
    },
    name:{
      type:String,
    },
    avatar:{
      type:String
    },
    date:{
      type:Date,
      default:Date.now
    }
  }
]
})


module.exports = Post = mongoose.model('post', PostSchema)
