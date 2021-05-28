import config from "config";
import * as apiBranches from "../routes";

function routes(app) {
	const apiVersion = <string>config.get("apiVersion");
	app.use(`/${apiVersion}`, apiBranches[apiVersion.toUpperCase()]);
}

export { routes };
