const express = require('express')
const { logger } = require('./middleware/logger');


const app = express()
const port = 3000



app.use(logger)

app.get('/', (req, res) => {
    res.send('hi')
})

app.listen(port, () => {
    console.log(`server working: http://localhost:${port}`)
})