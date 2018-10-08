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

let dataRooms = [];

const read = function (filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

const write = function (filename, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, 'utf-8', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

main.get('/', async ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./static/hello.html');
});

rooms.get('/', async ctx => {
    try {
        dataRooms = JSON.parse(await read('data/rooms.json'));
        ctx.response.body = dataRooms;
    } catch (e) {
        console.log(e);
        ctx.throw(500);
    }
});

acts.get('/month/:month', async ctx => {
    // TODO
    let rid = ctx.params.rid;
    let month = ctx.params.month;
    if (! dataRooms.some(r => r.id === rid) || ! /^\d{4}-\d{2}$/.test(month)) {
        ctx.throw(404); return;
    }
    let y = month.substr(0, 4), m = month.substr(5, 2);
    let r = [];
    try {
        r = JSON.parse(await read(`data/room1/${y}-${m}.json`));
    } catch (e) {}
    ctx.response.body = r;
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
