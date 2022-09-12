import express from 'express';
import { WebSocketServer } from 'ws';
import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import { spawn } from 'node-pty';

const app = express();
const port = 3000;

(async () => {
	await writeFileSync('./console.log', '');
	await appendFileSync('./console.log', `[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] Console starting...\n`);

	let consoleApp;
	switch (process.platform) {
		case 'win32': {
			consoleApp = 'cmd.exe';
			break;
		}

		case 'linux': {
			consoleApp = 'bash';
			break;
		}

		default: {
			throw new Error('Your system is not supported');
		}
	}

	const vTerminal = spawn(consoleApp, [], {
		name: 'live-console',
	});

	const clearData = (data) => {
		let clearData = '';
		for (let i = 0; i < data.length; i++) {
			if (data.charCodeAt(i) <= 127) {
				clearData += data.charAt(i);
			}
		}
		return clearData;
	}

	const vTonData = async (data) => {
		await appendFileSync('./console.log', data + '\n', { encoding: 'utf-8' });
	}

	vTerminal.onData(d => clearData(vTonData(d)));

	await appendFileSync('./console.log', `[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] Console started!\n`)

	const ws = new WebSocketServer({ port: 3001 });

	app.use('/public', express.static('public'));


	app.get('/', (req, res) => {
		res.sendFile('./index.html', { root: '.' });
	});

	ws.on('connection', async (client) => {
		console.log('connected')
		await readFileSync('./console.log', 'utf-8').split(/\r?\n/).forEach(line => {
			client.send(JSON.stringify({ type: 'consoleOutput', data: line }));
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