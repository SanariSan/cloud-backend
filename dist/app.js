"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var loaders_1 = require("./loaders");
var config_1 = __importDefault(require("config"));
var app = express_1.default();
app.use(loaders_1.middleware);
app.use(loaders_1.routes);
app.listen(config_1.default.get("port"), function () {
    console.log("server running on port : " + config_1.default.get("port"));
}).on("error", function (e) {
    console.log(e);
});
//# sourceMappingURL=app.js.map