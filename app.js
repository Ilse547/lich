const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logger');
const GUN = require('gun');

const app = express();
const port = process.env.PORT || 3000;

app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));

const server = require('http').createServer(app);

const gun = GUN({
    web: server,
    peers: [
        'https://gun-manhattan.herokuapp.com/gun',
        'https://gun-us.herokuapp.com/gun'
    ]
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('GUN relay peer running on port', port);
});