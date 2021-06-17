import axios from "axios";

function ping() {
	axios.get("https://storeton.herokuapp.com").catch(() => {});
}

export function scheduledPing() {
	setInterval(ping, 60000);
}

ping();
