const Koa = require('koa');
const kstatic = require('koa-static');
const kbody = require('koa-body');
const KRouter = require('koa-router');
const path = require('path');
const fs = require('fs');

const app = new Koa();

const staticPath = './static';
app.use(kstatic(path.join(__dirname, staticPath)));
app.use(kbody());

let main = new KRouter();
let rooms = new KRouter({ prefix: '/rooms' });
let acts = new KRouter({ prefix: '/acts' });

main.get('/', async ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./static/hello.html');
});

rooms.get('/', async ctx => {
    // TODO
    ctx.response.body = 'Rooms';
});

rooms.get('/:rid/month/:month', async ctx => {
    // TODO
    // ctx.toJSON({});
    ctx.response.body = ctx.params.rid + ' ' + ctx.params.month;
});

acts.get('/:aid', async ctx => {
    // TODO
    ctx.response.body = ctx.params.rid + ' ' + ctx.params.aid;
});

acts.post('/', async ctx => {
    // TODO
});

acts.delete('/:aid', async ctx => {
    // TODO
});

rooms.use('/:rid', acts.routes());
app.use(main.routes());
app.use(rooms.routes());

app.listen(3000);
