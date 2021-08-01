import * as apiBranches from "../routers/api";

function routers(app) {
	const apiVersion = <string>process.env.API_VERSION;
	app.use(`/${apiVersion}`, apiBranches[apiVersion.toUpperCase()]);
}

export { routers };
