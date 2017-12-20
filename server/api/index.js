const apiRouter = require('express').Router()
const cardRouter = require('./routes/Card')






apiRouter.use('/cards', cardRouter)





module.exports = apiRouter;