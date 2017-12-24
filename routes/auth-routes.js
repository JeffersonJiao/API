const express = require('express')
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user-model');

router.get('/login',(req,res)=>{
    if(!req.user){
        res.render('pages/login',{user:req.user});
    }
   else{
       res.redirect('/game/');
   }
});

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/auth/login');
});

router.get('/google',passport.authenticate('google',{
    scope: ['profile','email']
}));

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    res.redirect('/game/');
});




router.post('/login',passport.authenticate('local',{successRedirect:'/game',failureRedirect:'/auth/login',failureFlash:true}),
    (req,res)=>{
        res.redirect('/game');
    }
);
module.exports = router;