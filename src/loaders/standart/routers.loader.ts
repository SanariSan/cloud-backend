import config from "config";
import * as apiBranches from "../../routers/api";

function routers(app) {
	const apiVersion = <string>config.get("apiVersion");
	app.use(`/${apiVersion}`, apiBranches[apiVersion.toUpperCase()]);
}

export { routers };
