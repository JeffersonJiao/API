const unirest = require('unirest');
const router = require('express').Router();
const Quiz = require('../model/quiz-model');
const User = require('../model/user-model');
const authCheck = (req,res,next)=>{
    if(!req.user){
        res.redirect('/auth/login');
    }
    else{
        next();
    }
}


    

router.get('/',authCheck,(req,res)=>{
    // to add new sentence
    // new Quiz({
    //     sentence: "When I was little I had a car door slammed shut on my hand. I still remember it quite vividly." 
    // }).save().then((sentence)=>{
    //     console.log('new sentence added:' + sentence);
    // });
    res.render('./game/index',{user:req.user});
});

router.get('/quiz',authCheck,(req,res)=>{
    Quiz.aggregate({ $sample: { size: 10 } }).then((picked)=>{
        var text = picked
        var response = requestExc(text,(err,callback)=>{
        if(err) throw err;
            res.render('./game/quiz',{question:callback});
        });
    });
    
});

router.post('/quiz',authCheck,(req,res)=>{
    var score= 0;
    for(var i=0; i<10;i++){
        if(req.body.optradio[i]==req.body.answer[i])
            {
                score++;
            }
    }
    if(score > req.user.highestScore){
        User.update({"_id":req.user.id},{$set:{"highestScore": score}},(err,result)=>{
            if(err) throw err;
        });
    }
    res.render('./game/score',{user:req.user,score:score});
});

    
function requestExc(text,callback){
    var quizSet = [];
    for(var i = 0; i<text.length;i++){
        unirest.post("https://smallstep-englishgrammar-v1.p.mashape.com/grammar/diagnostic")
        .header("X-Mashape-Key", "rVOiQViq2RmshDSOmDNR8WL1bgvhp15WZ88jsnLVylLogEUUCP")
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .send({"text":text[i].sentence})
        .end(function (result) {
            var choices =  result.body[0].multipleChoice[0].answers;
            var question = result.body[0].multipleChoice[0].gapString;
            var answer = result.body[0].multipleChoice[0].correctIndex;
            quizSet.push({question: question,choices:choices,answer:answer});
            if(quizSet.length == text.length-1){
                callback(null,quizSet);
            }
        });
        
    }
    
}
module.exports = router;

