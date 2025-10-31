import express from 'express'
import { APIGateway } from '@gateway/server';

class Application {

    public init(): void {
        const app:express.Application = express();
        const apiGateway = new APIGateway(app);
        apiGateway.start();
    }
}
const app = new Application();
app.init();