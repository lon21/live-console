import express from 'express';
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';

const app = express();
const port = 3000;

(async () => {
	let ls;
	switch (process.platform) {
		case 'win32': {
			ls = spawn('cmd');
			break;
		}

		case 'linux': {
			ls = spawn('bash');
			break;
		}

		default: {
			throw new Error('Your system is not supported');
		}
	}

	const ws = new WebSocketServer({ port: 3001 });

	app.use('/public', express.static('public'));

	app.get('/', (req, res) => {
		res.sendFile('./index.html', { root: '.' });
	});

	ws.on('connection', (client) => {
		console.log('connected')
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