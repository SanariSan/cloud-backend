import cors from "cors";
import express from "express";
import path from "path";
import helmet from "helmet";

function settings(app) {
	app.use(
		cors({
			origin: true,
			// origin:
			// 	process.env.NODE_ENV === "production" ? `https://${process.env.CORS_URL}` : true,
			credentials: true,
			optionsSuccessStatus: 204,
		}),
	);
	app.enable("trust proxy");
	app.use(helmet());
	app.use(
		helmet.contentSecurityPolicy({
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
				connectSrc: ["*"],
				styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
				imgSrc: ["'self'", "'unsafe-inline'", "'data:'", "'blob:'"],
			},
		}),
	);

	app.use(express.json({ limit: "100mb" }));
	app.use(express.urlencoded({ limit: "100mb", extended: true }));
	app.set("x-powered-by", false);

	if (process.env.NODE_ENV === "production") {
		app.use(express.static(path.resolve("./cloud-front-build")));
	}
}

export { settings };
