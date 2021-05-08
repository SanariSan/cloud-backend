import cors from "cors";
import config from "config";
import express, { Router } from "express";

const settings = Router();
const corsUrl = <string>config.get("corsUrl");

settings.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
settings.use(express.json({ limit: "10mb" }));
settings.use(express.urlencoded({ limit: "10mb", extended: true }));

export { settings };
