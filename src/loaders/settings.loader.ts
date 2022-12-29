import cors from "cors";
import express from "express";
import path from "path";

function settings(app) {
	app.use(
		cors({
			origin:
				process.env.NODE_ENV === "production" ? `https://${process.env.CORS_URL}` : true,
			credentials: true,
			optionsSuccessStatus: 204,
		}),
	);
	app.enable("trust proxy");
	app.use(express.json({ limit: "100mb" }));
	app.use(express.urlencoded({ limit: "100mb", extended: true }));

	if (process.env.NODE_ENV === "production") {
		app.use(express.static(path.resolve("./cloud-front-build")));
	}
}

export { settings };
