import cors from "cors";
import express from "express";
import path from "path";

function settings(app) {
	const corsUrl =
		process.env.NODE_ENV === "production"
			? `https://${process.env.CORS_URL}`
			: `http://${process.env.HOST}:${process.env.PORT_FRONT}`;

	app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
	app.use(express.json({ limit: "100mb" }));
	app.use(express.urlencoded({ limit: "100mb", extended: true }));

	if (process.env.NODE_ENV === "production") {
		app.use(express.static(path.resolve("../cloud-front-build")));
	}
}

export { settings };
