'use strict'
const router = require('express').Router()
const { Card } = require('../../db/models')
const {Sequelize} = require('../../db/models')


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

    let queryName = req.params.value.toLowerCase()
    console.log('querying: ',queryName)

    Card.findAll({
            attributes: ['name', 'multiverseid', 'set', 'text', 'manaCost', 'uniqueName','fetchOptions','ProducibleManaColors','type','types'],
            limit: 10,

            where: {
                uniqueName: {
                    $iLike: queryName + '%'
                }
            }
        })
        .then(cards => {
            res.send(cards)
        })
        .catch(next);
})

module.exports = router;
