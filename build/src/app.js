"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
class Application {
    init() {
        const app = (0, express_1.default)();
        const apiGateway = new server_1.APIGateway(app);
        apiGateway.start();
    }
}
const app = new Application();
app.init();
//# sourceMappingURL=app.js.map