const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
	
}


const sendButtonOnclick = () => {
	const inputText = document.getElementById('consoleInput').value;
	if (!inputText) return;
	alert(inputText);
}