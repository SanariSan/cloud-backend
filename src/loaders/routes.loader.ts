import express from "express";
import config from "config";
import * as apiBranches from "../routes";

const routes = express();
const apiVersion = <string>config.get("apiVersion");
routes.use(`/${apiVersion}`, apiBranches[apiVersion]);

export { routes };
