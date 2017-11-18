'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const fs = require('fs');
const sequelize = require('sequelize');
const bodyParser = require('body-parser');
const path = require('path');
const models = require('./models/index');
const Card = models.Card;
const Deck = models.Deck;
const decks_cards = models.decks_cards;
const cardRouter = require('./routes/mtg');
var env = nunjucks.configure('views', { noCache: true });



app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.engine('html', nunjucks.render);
app.set('view engine', 'html');

app.use('/cards', cardRouter)

app.get('/', (req, res, next) => {
    res.render('index');
})



const PORT = 3000;

Card.sync()
    .then(() => {
        return Deck.sync()
    })
    .then(() => {
        return decks_cards.sync({ force: true })
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log('***************************')
            console.log(`Listening on Port: ${PORT}`);
        })
    })











