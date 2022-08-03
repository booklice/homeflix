"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = (req, res, next) => {
    if (!req.originalUrl.includes("_next")) {
        console.log(`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl} - ${new Date(Date.now()).toLocaleString()}`);
    }
    next();
};
exports.logger = logger;
