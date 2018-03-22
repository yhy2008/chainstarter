const { createServer } = require('http');
const next = require('next');
const config = require('./config');

const app = next({
    dev: config.NODE_ENV !== 'production'
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000, (err) => {
        if (err) throw err;
        console.log('Ready on localhost:3000');
    });
});