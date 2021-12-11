const User = require("../models/User");
const Messages = require("../models/Messages");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(200).redirect("/");
  } catch (error) {
    const errors = validationResult(req);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash("error", `${errors.array()[i].msg}`);
    }

    res.status(400).redirect("/register");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    bcrypt.compare(req.body.password, user.password, function (err, resp) {
      if (resp) {
        req.session.userID = user._id;
        res.status(200).redirect("/private");
      } else {
        req.flash("error", "password is not correct");
        res.status(400).redirect("/");
      }
    });
  } catch (error) {
    const errors = validationResult(req);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash("error", `${errors.array()[i].msg}`);
    }

    res.status(400).redirect("/");
  }
};

exports.privateChat = async (req, res) => {
  try {
    
    const user = await User.findOne({ slug: req.params.slug });
    const userin = await User.findById(req.session.userID)
    
    const usernames = Object.keys(users);
    const userlist = [];
    if (usernames.length > 0) {
      for (let i of usernames) {
        const user1 = await User.findById(i);
        userlist.push([user1.name, user1.slug]);
      }
    }
    if (user) {
      const messages = await Messages.find({
        $or: [
          { sender: req.session.userID, receiver: user._id },
          { sender: user._id, receiver: req.session.userID },
        ],
      });
      res.status(200).render('private', {
        user,
        messages,
        userlist,
        username: '1',
        userin
      })
    }else {
      
     
      res.status(200).render('private', {
        userlist,
        username: 'none',
        userin
      })
    }
  } catch (error) {
    req.flash("error", "something happened");
    console.log(error);
    res.status(400).redirect("/private");
  }
};

exports.createMessage = async (req, res) => {
  await Messages.create(req.body);
};


exports.addFriend = async(req,res) =>{
  const user = await User.findById(req.session.userID)
  const addedFriend = await User.findOne({slug: req.params.slug})
  if(!user.friends.includes(addedFriend.slug)){
    user.requests.push([addedFriend.name,addedFriend.slug])
    user.save()
  }
  res.status(200).redirect("/private")

}

exports.acceptReq = async (req,res) =>{
  const user = await User.findById(req.session.userID)
  const addedFriend = await User.findOne({slug: req.params.slug})
  user.requests.splice(user.requests.indexOf([addedFriend.name,addedFriend.slug]),1)
  addedFriend.friends.push([user.name,user.slug])
  addedFriend.save()
  user.friends.push([addedFriend.name,addedFriend.slug])
  user.save()
  res.status(200).redirect("/private")
}

exports.deleteFriend = async (req,res) =>{
  const user = await User.findById(req.session.userID)
  const deletedFriend = await User.findOne({slug: req.params.slug})
  user.friends.splice(user.friends.indexOf([deletedFriend.name,deletedFriend.slug]),1)
  user.save()
  deletedFriend.friends.splice(deletedFriend.friends.indexOf([user.name,user.slug]),1)
  deletedFriend.save()
  res.status(200).redirect("/private")
}