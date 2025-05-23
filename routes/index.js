var express = require('express');
var router = express.Router();
const userSchema=require('./user')
const postSchema=require('./post')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const passport = require('passport');
const multer=require('multer');
const crypto=require('crypto')
const GoogleStrategy = require('passport-google-oauth2').Strategy; 
require('./passport');
router.use(passport.initialize()); 
router.use(passport.session());

const userController = require('../controllers/userController.js');
const upload = require('../config/multerconfig.js');

router.get('/register', userController.loadAuth);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/register',function(req,res){
res.render('register');
});

router.post('/create',isLoggedIn,upload.single('postimage'), async function(req,res){
  const user = await userSchema.findOne({email:req.user.email});
  const post =await postSchema.create({
    user:user._id,
    tittle:req.body.tittle,
    description:req.body.description,
    image:req.file.filename,
  })
  user.posts.push(post._id)
  await user.save();
  res.redirect('/profile')
  });

 router.get('/login',function(req,res){
  res.render('login')
 }) 
  
 router.get('/create',function(req,res){
  res.render('create')
 }) 
   
 router.get('/settings',function(req,res){
  res.render('settings')
 }) 

 router.get('/feed',function(req,res){
  res.render('feed');
 })

 
 router.get('/feed',isLoggedIn,async function(req,res){
  const user = await userSchema.findOne({email:req.user.email});
  const posts= await postSchema.find()
  .populate('user')
  res.render('feed',{user, posts});

 }) 

 router.get('/profile',isLoggedIn, async function(req,res){
  const user = 
   await userSchema
        .findOne({email:req.user.email})
        .populate('posts')
        console.log(user)
  res.render('profile',{user})
 });

 router.get('/show/posts',isLoggedIn, async function(req,res){
  const user = 
   await userSchema
        .findOne({email:req.user.email})
        .populate('posts')
  res.render('show',{user})
 });


 router.post('/fileupload',isLoggedIn,upload.single('image'), async function(req,res){
  const user = await userSchema.findOne({email:req.user.email});
  user.profilepic=req.file.filename;
  await user.save()
  res.redirect('/profile')
 }) 
  
  


router.post('/register',async function(req,res){
  let {email,password,fullname, birthday}=req.body;
  const user=  await userSchema.findOne({email})
if(user) return res.status(500).send("user already their")

bcrypt.genSalt(10, function(err,salt){
  bcrypt.hash(password,salt, async function(err,hash){
      const user= await userSchema.create({
          email,
          fullname,
          birthday,
          password:hash
      })
     let token= jwt.sign({email:email,userid:user._id},"shhhh")
      res.cookie("token",token)
      res.redirect("/profile")
  })
})
  });
router.post('/login', async function(req,res){
  let {email,password}=req.body;
  const user=await userSchema.findOne({email})
if(!user) return res.status(200).send('something went wrong')
  bcrypt.compare(password, user.password, function(err, result) {
    if(result){
      let token= jwt.sign({email:email,userid:user._id},"shhhh")
      res.cookie("token",token)
      res.redirect("/profile")
    }
    else{
      res.redirect('/login')
    }

});

})

//logout
router.get('/logout',function(req,res){
  res.cookie("token","")
  res.redirect("/")
})



// Auth 
router.get('/register/google', passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
})); 

// Auth Callback 
router.get( '/auth/google/callback', 
	passport.authenticate( 'google', { 
		successRedirect: '/feed', 
		failureRedirect: '/failure'
}));

// Success 
router.get('/success' , userController.successGoogleLogin); 

// failure 
router.get('/failure' , userController.failureGoogleLogin);



function isLoggedIn(req,res,next){
  if(req.cookies.token==="") res.redirect("/login")
      else{
  let data=jwt.verify(req.cookies.token,"shhhh")
  req.user=data;
  next();
}
}


module.exports = router;
