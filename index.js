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
		fs.readFile(filename, 'utf8', (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
};

const write = function (filename, content) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filename, content, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};

const getByMonth = async function (rid, y, m) {
	let r = [];
	try {
		r = JSON.parse(await read(`data/${rid}/${y}-${m}.json`));
	} catch (e) {}
	return r;
};

dataRooms = JSON.parse(fs.readFileSync('data/rooms.json', 'utf8'));
dataRooms.forEach(r => {
	if (!fs.existsSync('data/' + r.id))
		fs.mkdirSync('data/' + r.id);
});

main.get('/', async ctx => {
	ctx.response.type = 'html';
	ctx.response.body = fs.createReadStream('./static/main.html');
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
	let rid = ctx.params.rid;
	let month = ctx.params.month;
	if (! dataRooms.some(r => r.id === rid) || ! /^\d{4}-\d{2}$/.test(month)) {
		ctx.throw(400); return;
	}
	let y = month.substr(0, 4), m = month.substr(5, 2);
	let r = await getByMonth(rid, y, m);
	ctx.response.body = r;
});

acts.get('/from/:from/to/:to', async ctx => {
	let rid = ctx.params.rid;
	let fromStr = ctx.params.from;
	let toStr = ctx.params.to;
	if (! dataRooms.some(r => r.id === rid)
		|| ! /^\d{4}-\d{2}-\d{2}$/.test(fromStr)
		|| ! /^\d{4}-\d{2}-\d{2}$/.test(toStr)) {
		ctx.throw(400); return;
	}
	let from = fromStr.split('-').map(i => parseInt(i));
	let to = toStr.split('-').map(i => parseInt(i));
	let r = [];
	let year = from[0], month = from[1];
	while (year < to[0] || (year == to[0] && month <= to[1])) {
		r = r.concat(await getByMonth(rid, year.toString(), month.toString()));
		month++;
		if (month > 12) {
			year++;
			month = 1;
		}
	}
	while (r.length && r[0].end < fromStr.substr(0, 10))
		r.shift();
	while (r.length && r[r.length - 1].begin > toStr.substr(0, 10))
		r.pop();
	ctx.response.body = r;
});

acts.get('/:aid', async ctx => {
	// TODO
	ctx.response.body = ctx.params.rid + ' ' + ctx.params.aid;
});

acts.post('/', async ctx => {
	let rid = ctx.params.rid;
	try {
		let body = JSON.parse(ctx.request.body);
		if (!body.begin || ! /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(body.begin)
			|| !body.end || ! /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(body.end)
			|| !body.user) {
				ctx.throw(400);
				return;
			}
		let act = {
			begin: body.begin,
			end: body.end,
			user: body.user,
		};
		let y = body.begin.substr(0, 4), m = body.begin.substr(5, 2);
		let r = await getByMonth(rid, y, m);

		r.forEach(a => {
			if (!(a.end <= act.begin || act.end <= a.begin))
				ctx.throw(400);
				return;
		});

		r.push(act);
		r.sort((a, b) => a.begin - b.begin);
		await write(`data/${rid}/${y}-${m}.json`, JSON.stringify(r));
		ctx.response.body = { "status": 0 };
	} catch (e) {
		console.log(e);
		ctx.throw(500);
	}
});

acts.delete('/:aid', async ctx => {
	// TODO
});

rooms.use('/:rid', acts.routes());
app.use(main.routes());
app.use(rooms.routes());

app.listen(3000);
