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

router.get('/filteredcards/:value', (req, res, next) => {
    Card.findAll({
        attributes: ['name', "multiverseid"],
        where: {
            name: {
                $like: req.params.value + '%'
            }
        },
        limit: 10
    })
        .then(cards => {
            res.send(cards)
        })
        .catch(next);
})




module.exports = router;