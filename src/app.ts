import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';
import bodyParser from 'body-parser';
import genericErrorHandler from './middlewares/genericErrorHandler';

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

app.use(genericErrorHandler);

export default app;
