const router = require('express').Router();
const passport = require('passport');
const User = require('../model/user-model');

router.get('/',(req,res)=>{
    res.render('./pages/home',{user:req.user});
});

router.get('/topscores',(req,res)=>{
    User.find( {highestScore: {$exists: true}} ).sort({highestScore : -1}).limit(5).then((leaders)=>{
        if(leaders){
            res.render('./pages/topscores',{user:req.user,leaders:leaders});
        }
    });
});

router.get('/gameplay',(req,res)=>{
    res.render('./pages/gameplay',{user:req.user});
});

module.exports = router;