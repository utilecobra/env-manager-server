import mongoose = require('mongoose');
import { Document, Model } from 'mongoose';
import { IService } from '../interfaces/service.interface';
import { serviceSchema } from '../schemas/service.schema';

export interface ServiceModel extends IService, Document { }

// tslint:disable-next-line:no-empty-interface
export interface ServiceModelStatic extends Model<ServiceModel> { }

export const Service = mongoose.model<ServiceModel, ServiceModelStatic>('Service', serviceSchema);
