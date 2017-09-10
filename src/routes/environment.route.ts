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
    environment.save().then(environment => {
      res.json(environment.toObject());
      next();
    }).catch(next);
  }

  public get(req: Request, res: Response, next: NextFunction) {
    var response: EnvironmentApi = null;

    const PARAM_ID: string = 'id';
    if(req.params[PARAM_ID] === undefined) {
      res.sendStatus(404);
      next();
      return;
    }

    const id: string = req.params[PARAM_ID];
    Environment.findById(id).then(environment => {
      if (environment === null) {
        res.sendStatus(404);
        next();
        return;
      }

      response = {
        id: environment._id,
        displayName: environment.displayName,
        host: environment.host
      }

      res.json(response);
      next();
    }).catch(next);
  }
}

export default new EnvironmentRouter().router;
