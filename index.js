const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Question = require('./models/Question');
const Response = require('./models/Response');

// Database
connection.authenticate().then(() => {}).catch((e) => {
    console.log(e);
});

// EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));

// BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    Question.findAll({
        raw: true, 
        order: [
            ['id', 'DESC']
        ]
    }).then(questions => {
        res.render('index', {
            questions: questions
        });
    });
});

app.get('/question', (req, res) => {
    res.render('question');
});

app.post('/save-question', (req, res) => {
    Question.create({
        title: req.body.inputTitle,
        description: req.body.inputDescription
    }).then(() => {
        res.redirect('/');
    });
});

app.get('/question/:id', (req, res) => {
    Question.findOne({
        where: {
            id: req.params.id
        }
    }).then(question => {
        if (question != undefined) {
            Response.findAll({
                where: {
                    idQuestion: question.id
                },
                order: [
                    ['id', 'DESC']
                ]
            }).then(responses => {
                res.render('answerQuestion', {
                    question: question,
                    responses: responses
                });
            });
        } else {
            res.redirect('/');
        }

    });
});

app.post('/save-response', (req, res) => {
    Response.create({
        body: req.body.inputResponse,
        idQuestion: req.body.inputIdQuestion
    }).then(() => {
        res.redirect('/question/' + req.body.inputIdQuestion);
    });
});

// Server
app.listen(8080, () => {});