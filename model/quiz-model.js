const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const quizSchema = new Schema({
    sentence: String
});

const Quiz = mongoose.model('quiz',quizSchema);

module.exports = Quiz;

