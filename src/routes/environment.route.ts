import { Router, Request, Response, NextFunction } from 'express';

import { Environment } from '../models/environment.model';
import { Service } from '../models/service.model';

import { EnvironmentItemApi } from '../apis/environment-item.api';
import { EnvironmentApi } from '../apis/environment.api';
import { ServiceItemApi } from '../apis/service-item.api';

const PARAM_ID = 'id';

export class EnvironmentRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.get('/', this.list);
    this.router.post('/', this.create);
    this.router.get(`/:${PARAM_ID}([0-9a-f]{24})`, this.get);
    this.router.delete(`/:${PARAM_ID}([0-9a-f]{24})`, this.delete);
    this.router.get(`/:${PARAM_ID}([0-9a-f]{24})/services`, this.listServices);
  }

  public list(req: Request, res: Response, next: NextFunction) {
    const response: EnvironmentItemApi[] = [];

    Environment.find().then(environments => {
      environments.forEach(environment => {
        response.push({
          id: environment._id,
          displayName: environment.displayName,
          host: environment.host
        });
      });
      res.json(response);
      next();
    }).catch(next);
  }

  public create(req: Request, res: Response, next: NextFunction) {
    const environment = new Environment(req.body);
    let response: EnvironmentApi;
    // Create and respond
    environment.save().then(env => {
      response = {
        id: env._id,
        displayName: env.displayName,
        host: env.host
      };
      res.json(response);
      next();
    }).catch(next);
  }

  public get(req: Request, res: Response, next: NextFunction) {
    let response: EnvironmentApi;
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
      };
      res.json(response);
      next();
    }).catch(next);
  }

  public delete(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params[PARAM_ID];

    Environment.findById(id).then(environment => {
      // Check, if exists
      if (environment === null) {
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

  public listServices(req: Request, res: Response, next: NextFunction) {
    const response: ServiceItemApi[] = [];
    const environmentId = req.params[PARAM_ID];
    console.log(req.params);

    Service.find({environmentId: environmentId})
      .then (services => {
        services.forEach(service => {
          response.push({
            id: service._id,
            displayName: service.displayName,
            type: service.type,
            health: 'green'
          });
        });
        res.json(response);
        next();
      })
      .catch(next);
  }
}

export default new EnvironmentRouter().router;
