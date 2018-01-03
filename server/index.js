'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const sequelize = require('sequelize');
const bodyParser = require('body-parser');
const path = require('path');
const { db } = require('./db/models/index')


app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', require('./api'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
}); // Send index.html for any other requests


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error');
});

const PORT = 4000;

db.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log('***************************')
            console.log(`Listening on Port: ${PORT}`);
        })
    })
