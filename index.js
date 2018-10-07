const Koa = require('koa');
const koa_static = require('koa-static');
const path = require('path');
const app = new Koa();

const staticPath = './static';

app.use(koa_static(path.join(__dirname, staticPath)));

app.use(async ctx => {
    ctx.body = 'Hello Koa';
});

app.listen(3000);
