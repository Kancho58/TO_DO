import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';
import bodyParser from 'body-parser';

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

export default app;
