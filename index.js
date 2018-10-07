const Koa = require('koa');
const kstatic = require('koa-static');
const kroute = require('koa-route');
const path = require('path');
const app = new Koa();

const staticPath = './static';

app.use(kstatic(path.join(__dirname, staticPath)));

app.use(kroute.get('/', async ctx => {
    ctx.body = 'Hello Koa';
    ctx.toJSON({});
}));

app.listen(3000);
