const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
var expressLayouts = require('express-ejs-layouts');
const LocalStrategy = require('passport-local').Strategy;
const authRoutes = require('./routes/auth-routes');
const gameRoutes = require('./routes/game-routes');
const pageRoutes = require('./routes/page-routes');
const RegistrationController = require('./controller/RegistrationController');
const app = express();
const port = process.env.PORT ||3000;
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const mongo = require('mongodb');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const expressSession = require('express-session');
const passport = require('passport');



app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey]
}))

app.use(expressLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(expressSession({
    secret: keys.session.sessionKey,
    resave: false,
    saveUninitialized: true
}));

app.use(expressValidator({
    errorFormatter: (param,msg,value)=>{
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']'
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

app.use(flash());


app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.errors = req.validationErrors() || null;
    res.locals.user = req.user || null;
    next();
});
//connect to mongo DB
mongoose.connect(keys.mongoDB.dbURI,()=>{
    console.log('connected');
});


app.use(express.static('./public'));


app.use('/auth',authRoutes);
app.use('/game',gameRoutes);
app.use(pageRoutes);
app.use(RegistrationController);

app.listen(port,()=>{
    console.log('app now listening on port 3000');
});