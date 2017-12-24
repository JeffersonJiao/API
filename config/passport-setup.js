const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../model/user-model');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    });
});

passport.use(new GoogleStrategy({
    //options for the google strat
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret 
},(accessToken,refreshToken,profile,done)=>{
    //passport callback function
    var email = profile.emails[0].value;
    User.findOne({googleId:profile.id}).then((currentUser)=>{
        
        if(currentUser){
            console.log("current user");
            done(null,currentUser);
        }
        else{
            new User({
                username: profile.displayName,
                googleId: profile.id,
                email: email,
                password: null,
                highestScore: 0

            }).save().then((newUser)=>{
                console.log('new user created:' + newUser)
                done(null,currentUser);
            })
        }
    })
})
);


passport.use(new LocalStrategy(
    (username,password,done)=>{
        User.getUserByEmail(username,(err,user)=>{
            if(err) throw err;
            if(!user){
                return done(null,false,{message: 'Unknown User'});
            }
            if(user.password == null){
                return done(null,false,{message: 'Password not set. Please log in using google plus'});
            }
            User.comparePassword(password,user.password,(err,isMatch)=>{
                if(isMatch){
                    return done(null,user);
                }
                else{
                    return done(null,false,{message: 'Invalid Password'});
                }
            });
        });
    }));

