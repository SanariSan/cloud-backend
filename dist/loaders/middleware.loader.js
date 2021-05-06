"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var express_1 = require("express");
var middleware = express_1.Router();
exports.middleware = middleware;
middleware.use(cors_1.default());
middleware.use(body_parser_1.default.json({ limit: "10mb" }));
middleware.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
//# sourceMappingURL=middleware.loader.js.map