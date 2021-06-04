import config from "config";
import cors from "cors";
import express from "express";

function settingsServices(app) {
	const corsUrl = <string>config.get("corsUrl");

	app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
	app.use(express.json({ limit: "10mb" }));
	app.use(express.urlencoded({ limit: "10mb", extended: true }));
}

export { settingsServices };
