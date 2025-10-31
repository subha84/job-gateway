import { config } from "@gateway/config";
import { BadRequestError, IAuthPayload, NotAuthorizedError } from "@subha84/jobber-shared";
import { NextFunction, Request, Response } from "express";
import { verify} from 'jsonwebtoken'
class AuthMiddleWare {

    public verifyUser(req: Request, _res: Response, next:NextFunction): void {
        // If request coming from frontend, otherwise throw error.
        if(!req.session?.jwt){
            throw new NotAuthorizedError( 'User is not Authorized, Please login again', 'GatewayService verifyUser()' );
        }
        try{
            const payload: IAuthPayload =  verify(req.session.jwt, config.JWT_TOKEN as string) as IAuthPayload;
            req.currentUser = payload;
        }catch{
             throw new NotAuthorizedError(' Invalid token, Please login again', 'Gateway verifyUser()')
        }
        next();
    }

    public checkAuthentication(req: Request, _res:Response, next:NextFunction): void {
        if(!req.currentUser){
            throw new BadRequestError('Authentication is required to access this route', 'Gateway checkAuthentication()');
        }
        next();
    }
}

export const authMiddleware:AuthMiddleWare = new AuthMiddleWare();