//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true,useUnifiedTopology:true})

const app = express()

userSchema = new mongoose.schema({
  email:String,
  password:String
})

secret = process.env.SECRET
userSchema.plugin(encrypt,{secret:secret,encryptedField:['password']})

const User = mongoose.model('User',userSchema)


app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('view engine','ejs');


app.get('/',function(req,res){
  res.render('home')
})
app.get('/register',function(req,res){
  res.render('register')
})

app.post('/register',function(req,res){
  const user = new User({
    email    : req.body.username,
    password : req.body.password
  })
  user.save(function(err){
    if(!err){
      res.render('secrets')
    }
    else {
      res.send(err)
    }
  })

})

app.get('/login',function(req,res){
  res.render('login')
})

app.post('/login',function(req,res){
  email = req.body.username
  password = req.body.password

  User.findOne({email:email},function(err,foundUser){

      if(foundUser.password === password){
        res.render('secrets')
      }
      else {
        res.send('Unknown username or password')
      }

      })


})



app.get('/secrets',function(req,res){
  res.render('secrets')
})

app.get('/submit',function(req,res){
  res.render('submit')
})







app.listen(3000,function(){
  console.log('server started on port 3000');
})
