'use strict'
const router = require('express').Router()
const probabilityOfPlayingCard = require('../../../__alg/ArithmaticHelpers')

router.post('/', (req, res, next) => {
  console.log('inside route', req.body.draws, req.body.card.name, req.body.deck.length)
  const p = probabilityOfPlayingCard(req.body.draws, req.body.card, req.body.deck)
  console.log('P',p)
  res.status(200)
  res.json(p)
})

module.exports = router;
