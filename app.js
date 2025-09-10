const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logger');

const app = express();
const port = 3000;

app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`server working: http://localhost:${port}`)
})