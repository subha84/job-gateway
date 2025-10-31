import { Logger } from "winston";
import { CustomError, IErrorResponse, winstonLogger } from "@subha84/jobber-shared";
import { json, NextFunction, Request, Response, urlencoded, type Application } from "express";
import cookieSession from "cookie-session";
import hpp from "hpp";
import helmet from "helmet";
import cors from 'cors';
import compression from "compression";
import { StatusCodes  } from "http-status-codes"; 
import http from 'http';
import {config} from '@gateway/config' 
import { elasticSearch } from '@gateway/elasticsearch'  
import { appRoutes } from "@gateway/routes";

const SERVER_PORT=4000;
const log:Logger = winstonLogger(config.ELASTIC_SEARCH_URL as string,'apiGeteway', 'debug');

export class APIGateway {
    private app:Application;

    constructor(app:Application){
        this.app = app;
    }

    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleWare(this.app);
        this.routesMiddleware(this.app);
        this.startElasticSearch();
        this.errorHandler(this.app);
        this.startServer(this.app);
    }

    private securityMiddleware(app: Application): void {
        app.set('trust proxy', 1);
        app.use(    
            cookieSession({
                name:'session',
                keys:[`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
                maxAge: 24*7*36000,
                secure:config.NODE_ENV !== 'development'
            })
        );
        app.use(hpp());
        app.use(helmet());
        app.use(cors({
            origin: `${config.CLIENT_URL}`,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }))
    }

    private standardMiddleWare(app:Application): void {
        app.use(compression());
        app.use(urlencoded({ extended: true, limit: '200mb'}));
        app.use(json({ limit: '200mb'}));
    }

    private routesMiddleware(app:Application): void {
        appRoutes(app);
    }

    private async startElasticSearch(): Promise<void> {
        await elasticSearch.checkConnection();
    }

    private errorHandler( app:Application ): void {
        app.use(( req:Request, res: Response, next:NextFunction ): void=> {
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            log.log('error', `${fullUrl} does not exist`);
            res.status(StatusCodes.NOT_FOUND).json({message: 'The endpoint called does not exist'});
        });
        app.use(( err:IErrorResponse, _req: Request, res: Response, next:NextFunction )=> {
            if( err instanceof CustomError){
                res.status(StatusCodes.NOT_FOUND).json(err.serializeErrors())            
            }
            next();
        });
    }

    private async startServer(app:Application): Promise<void> {
        try{
            const httpServer:http.Server = new http.Server(app);
            this.startHttpServer(httpServer);

        }catch(error){
            log.log('error', 'Gateway service startServer', error)
        }
    }

    private async startHttpServer(httpServer:http.Server): Promise<void> {
        try{
            log.info( `Gateway service has started with process id ${process.pid}`);
            httpServer.listen(SERVER_PORT, ()=> {
                log.info( `Gateway server running on port ${SERVER_PORT}`);
            })

        }catch(error){
            log.log('error', 'Gateway service startSerever')
        }
    }

}