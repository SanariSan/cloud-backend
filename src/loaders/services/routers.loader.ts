import { ServicesRouter } from "../../routers/services";

function routersServices(app) {
	app.use(`/services`, ServicesRouter);
}

export { routersServices };
