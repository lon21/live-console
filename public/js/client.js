const ws = new WebSocket('ws://localhost:3001');
const output = document.getElementById('output');

ws.onopen = () => {
	
}

ws.onmessage = (message) => {
	const msg = JSON.parse(message.data);
	if (msg.type === 'consoleOutput') {
		output.innerHTML += msg.data+'</br>';
	}
}

document.addEventListener('keypress', key => {
	if (key.code === 'Enter' && !key.shiftKey) return sendButtonOnclick();
})

const sendButtonOnclick = () => {
	const input = document.getElementById('consoleInput');
	const inputText = input.value;

	input.value = null;
	
	if (!inputText) return;
	alert(inputText);
}