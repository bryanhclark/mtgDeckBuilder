'use strict'
const router = require('express').Router()
const {
    Card
} = require('../../db/models')


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
    // console.log('in route', req.params.value)
    Card.findAll({
            attributes: ['name', "multiverseid", 'set', 'text', 'manaCost', 'uniqueName'],
            where: {
                name: {
                    $like: ((req.params.value.indexOf('#') === -1) ? req.params.value : req.params.value.slice(0, req.params.value.indexOf('(') - 1)) + '%'
                }
            },
            limit: 10
        })
        .then(cards => {
            console.log('leaving route', cards[0])
            res.send(cards)
        })
        .catch(next);
})




module.exports = router;