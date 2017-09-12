import { Router, Request, Response, NextFunction } from 'express';

import { Service } from '../models/service.model';

import { ServiceItemApi } from '../apis/service-item.api';
import { ServiceStatusApi } from '../apis/service-status.api';

const INIT_SERVICES = [
  {
    environmentId: '59b6516705acfb14e854eb1a',
    serviceName: 'cassandra',
    displayName: 'Cassandra',
    type: 'static'
  },
  {
    environmentId: '59b6516705acfb14e854eb1a',
    serviceName: 'common-api-gateway',
    displayName: 'Common GW',
    type: 'swarm'
  },
];

export class ServiceRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.post('/init', this.initialize);
    this.router.get('/:id([0-9a-f]{24})/status', this.getStatus);
  }

  public initialize(req: Request, res: Response, next: NextFunction) {
    if (Service.collection.length > 0) {
      Service.collection.drop();
    }
    INIT_SERVICES.forEach(initService => {
      const service = new Service(initService);
      service.save();
    });
    res.sendStatus(200);
    next();
  }

  public getStatus (req: Request, res: Response, next: NextFunction) {
    let response: ServiceStatusApi;

    response = {
      nodesRequired: 1,
      nodesPresent: 1,
      health: 'green',
    };
    res.json(response);
    next();
  }

  public test(req: Request, res: Response, next: NextFunction) {
    const consul = require('consul')({host: 'e-qa.betacom.com.pl'});
    consul.health.service('cassandra', (err, result) => {
      res.json(result);
      next();
    });
  }
}

export default new ServiceRouter().router;
