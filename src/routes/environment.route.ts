import { Router, Request, Response, NextFunction } from 'express';

import { Environment } from '../models/environment.model';

import { EnvironmentItemApi } from '../apis/environment-item.api';
import { EnvironmentApi } from '../apis/environment.api';

export class EnvironmentRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.get('/', this.list);
    this.router.post('/', this.create);
    this.router.get('/:id([0-9a-f]{24})', this.get);
    this.router.delete('/:id([0-9a-f]{24})', this.delete);
    this.router.get('/test', this.test);
  }

  public list(req: Request, res: Response, next: NextFunction) {
    var response: EnvironmentItemApi[] = [];

    Environment.find().then(environments => {
      environments.forEach(environment => {
        response.push({
          id: environment._id,
          displayName: environment.displayName,
          host: environment.host
        })
      });

      res.json(response);
      next();
    }).catch(next);
  }

  public create(req: Request, res: Response, next: NextFunction) {
    const environment = new Environment(req.body);
    var response: EnvironmentApi;
    // Create and respond
    environment.save().then(environment => {
      response = {
        id: environment._id,
        displayName: environment.displayName,
        host: environment.host
      }
      res.json(response);
      next();
    }).catch(next);
  }

  public get(req: Request, res: Response, next: NextFunction) {
    var response: EnvironmentApi;
    const PARAM_ID: string = 'id';
    const id: string = req.params[PARAM_ID];

    Environment.findById(id).then(environment => {
      // Check, if exists
      if (environment === null) {
        res.sendStatus(404);
        next();
        return;
      }
      // Respond
      response = {
        id: environment._id,
        displayName: environment.displayName,
        host: environment.host
      }
      res.json(response);
      next();
    }).catch(next);
  }

  public delete(req: Request, res: Response, next: NextFunction) {
    const PARAM_ID: string = 'id';
    const id: string = req.params[PARAM_ID];

    Environment.findById(id).then(environment => {
      // Check, if exists
      if(environment === null) {
        res.sendStatus(404);
        next();
        return;
      }
      // Delete and respond
      environment.remove().then(() => {
        res.sendStatus(204);
        next();
      }).catch(next);
    }).catch(next);
  }

  public test(req: Request, res: Response, next: NextFunction) {
    var consul = require('consul')({host: 'e-qa.betacom.com.pl'});
    consul.health.service('cassandra', (err, result) => {
      res.json(result);
      next();
    })
  }
}

export default new EnvironmentRouter().router;
