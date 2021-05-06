"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
var routes_1 = require("../routes");
var express_1 = __importDefault(require("express"));
var routes = express_1.default();
exports.routes = routes;
routes.use("/v1", routes_1.routesV1);
routes.use(function (req, res, next) { return next("not found error"); });
routes.use(function (err, req, res, next) {
    console.log(err);
    return res.status(500).send(err.message);
});
//# sourceMappingURL=routes.loader.js.map