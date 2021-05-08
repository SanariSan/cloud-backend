"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesV1 = void 0;
var express_1 = require("express");
var profile_1 = require("./profile");
var routesV1 = express_1.Router();
exports.routesV1 = routesV1;
routesV1.use("/profile", profile_1.Profile);
