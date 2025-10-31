"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIGateway = void 0;
const jobber_shared_1 = require("@subha84/jobber-shared");
const express_1 = require("express");
const cookie_session_1 = __importDefault(require("cookie-session"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const http_status_codes_1 = require("http-status-codes");
const http_1 = __importDefault(require("http"));
const SERVER_PORT = 4000;
const log = (0, jobber_shared_1.winstonLogger)('', 'apiGeteway', 'debug');
class APIGateway {
    constructor(app) {
        this.app = app;
    }
    start() {
        this.securityMiddleware(this.app);
        this.standardMiddleWare(this.app);
        this.routesMiddleware();
        this.startElasticSearch();
        this.errorHandler(this.app);
        this.startServer(this.app);
    }
    securityMiddleware(app) {
        app.set('trust proxy', 1);
        app.use((0, cookie_session_1.default)({
            name: 'session',
            keys: [],
            maxAge: 24 * 7 * 36000,
            secure: false
        }));
        app.use((0, hpp_1.default)());
        app.use((0, helmet_1.default)());
        app.use((0, cors_1.default)({
            origin: '',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }));
    }
    standardMiddleWare(app) {
        app.use((0, compression_1.default)());
        app.use((0, express_1.urlencoded)({ extended: true, limit: '200mb' }));
        app.use((0, express_1.json)({ limit: '200mb' }));
    }
    routesMiddleware() {
    }
    startElasticSearch() {
    }
    errorHandler(app) {
        app.use('*', (req, res) => {
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            log.log('error', `${fullUrl} does not exist`);
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist' });
        });
        app.use((err, _req, res, next) => {
            if (err instanceof jobber_shared_1.CustomError) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(err.serializeErrors());
            }
            next();
        });
    }
    async startServer(app) {
        try {
            const httpServer = new http_1.default.Server(app);
            this.startHttpServer(httpServer);
        }
        catch (error) {
            log.log('error', 'Gateway service startServer', error);
        }
    }
    async startHttpServer(httpServer) {
        try {
            log.info(`Gateway service has started with process id ${process.pid}`);
            httpServer.listen(SERVER_PORT, () => {
                log.info(`Gateway server running on port ${SERVER_PORT}`);
            });
        }
        catch (error) {
            log.log('error', 'Gateway service startSerever');
        }
    }
}
exports.APIGateway = APIGateway;
//# sourceMappingURL=server.js.map