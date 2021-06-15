import cors from "cors";
import express from "express";
import path from "path";

function settings(app) {
	// const corsUrl = <string>process.env.CORS_URL;

	// app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
	app.use(cors());
	app.use(express.json({ limit: "10mb" }));
	app.use(express.urlencoded({ limit: "10mb", extended: true }));
	app.use(express.static(path.resolve("../../../../", "cloud-front-build")));
}

export { settings };
