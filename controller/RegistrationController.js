const router = require('express').Router();
const passport = require('passport');
const User = require('../model/user-model');

router.get('/register',(req,res)=>{
    res.render('pages/register');
});

router.post('/register',(req,res)=>{
    var username = req.body.username;
    var email = req.body.email;
    var pwd = req.body.pwd;
    var cpwd = req.body.cpwd;
    console.log(pwd + ":" + cpwd);
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('email',"Email is required").notEmpty();
    req.checkBody('email','Email address is not valid').isEmail();
    req.checkBody('pwd','Password is required').notEmpty();
    req.checkBody('cpwd','Passwords do not match').equals(req.body.pwd)
    var errors = req.validationErrors();
    if(errors){
        res.render('./pages/register',{errors:errors});
    }
    else{
        User.findOne({email:email}).then((currentUser)=>{
            if(currentUser){
                req.flash('error_msg','Email address is already registered');
                res.redirect('/auth/login');
            }
            else{
                var newUser = new User({
                    username: username,
                    email: email,
                    password: pwd,
                    highestScore: 0
                });
        
                User.createUser(newUser,(err,user)=>{
                    if(err) throw err;
                    console.log(user);
                });
                req.flash('success_msg','You are registered and now can login');
                res.redirect('/auth/login');
            }
        });
    }
});


module.exports = router;