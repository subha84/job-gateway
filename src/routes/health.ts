import { Health } from '@gateway/controller/health';
import express, { Router} from 'express'

class HealthRoute {
    private router: Router;
    constructor(){
        this.router = express.Router();
    }
    public routes(): Router {
        this.router.get('/gateway-health',Health.health )
        return this.router;
    }
}

export const healthRoutes: HealthRoute = new HealthRoute();