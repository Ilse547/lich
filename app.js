const express = require('express')
const app = express()
const port = 3000


const { logger } = require('./middleware/logger');

app.use(logger)

app.get('/', (req, res) => {
    res.send('hi')
})

app.listen(port, () => {
    console.log(`example app: http://localhost:${port}`)
})