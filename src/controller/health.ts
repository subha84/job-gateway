import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class Health {
    public static health(_req:Request, resp:Response): void {
        resp.status(StatusCodes.OK).send('API Gateway is healthy and running');
    }
}