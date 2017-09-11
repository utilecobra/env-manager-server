import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import mongoose = require('mongoose');

import EnvironmentRouter from './routes/environment.route';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.init();
  }

  private middleware(): void {
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({
      extended: true
    }));
  }

  private routes(): void {
    // CORS
    const corsOptions: cors.CorsOptions = {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: "http://localhost:4200",
      preflightContinue: false
    };
    this.express.use(cors(corsOptions));
    // Routes
    this.express.use('/api/v1/environments', EnvironmentRouter)
  }

  private init(): void {
    mongoose.Promise = require('q').Promise;

    mongoose.connect('mongodb://e-qa.betacom.com.pl:27017/env-manager', {useMongoClient: true});
    mongoose.connection.on('error', error => {
      console.error(error);
    });
  }
}

export default new App().express;
