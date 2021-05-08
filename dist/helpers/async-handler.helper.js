"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (execution) { return function (req, res, next) {
    execution(req, res, next).catch(next);
}; });
