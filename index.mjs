import express from 'express';
import { WebSocketServer } from 'ws';
import { spawnSync } from 'child_process';
import { appendFileSync, readFileSync, writeFileSync } from 'fs';

const app = express();
const port = 3000;

(async () => {
	await writeFileSync('./console.log', '');
	await appendFileSync('./console.log', `[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] Console starting...\n`);

	let ls;
	switch (process.platform) {
		case 'win32': {
			ls = await spawnSync('cmd');
			break;
		}

		case 'linux': {
			ls = await spawnSync('bash');
			break;
		}

		default: {
			throw new Error('Your system is not supported');
		}
	}

	await appendFileSync('./console.log', `[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] Console started!\n`)

	const ws = new WebSocketServer({ port: 3001 });

	app.use('/public', express.static('public'));

	app.get('/', (req, res) => {
		res.sendFile('./index.html', { root: '.' });
	});

	ws.on('connection', async (client) => {
		console.log('connected')
		await readFileSync('./console.log', 'utf-8').split(/\r?\n/).forEach(line => {
			client.send(JSON.stringify({ type: 'consoleOutput', data: line+'</br>' }));
		});
		client.onmessage = (msg) => {
			console.log(msg.data);
		}
	});

	ws.on('listening', () => {
		console.log('WebSocket is ready');
	});

	app.listen(port, () => {
		console.log(`App is listening on port ${port}`);
	});
})();