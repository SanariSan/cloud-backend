function ping() {
	fetch("https://storeton.herokuapp.com").catch(() => {});
}

export function scheduledPing() {
	setInterval(ping, 60000);
}
