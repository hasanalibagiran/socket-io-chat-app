const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const slugify = require("slugify");


const UserSchema = new Schema({
    name: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    friends: [{
        type: Array
    }],
    requests: [{
        type: Array
    }],
    slug: {
        type: String,
        unique: true
    }
})   
   
UserSchema.pre('save', function(next){
    const user = this
    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10, (error,hash)=>{
        user.password = hash
        next()
    })
})


UserSchema.pre("validate", function (next) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
    next();
  });


const User = mongoose.model('users',UserSchema)
module.exports= User