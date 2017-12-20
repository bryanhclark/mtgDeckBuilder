'use strict'
const router = require('express').Router()
const { Card } = require('../../db/models')


router.get('/allcards', (req, res, next) => {
    Card.findAll({
        attributes: ['name', "multiverseid"]
    })
        .then(cards => {

            res.send(cards);
        })
        .catch(next);
})




module.exports = router;