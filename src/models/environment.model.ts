import mongoose = require('mongoose');
import { Document, Model } from 'mongoose';
import { IEnvironment } from '../interfaces/environment.interface';
import { environmentSchema } from '../schemas/environment.schema';

export interface EnvironmentModel extends IEnvironment, Document { }

// tslint:disable-next-line:no-empty-interface
export interface EnvironmentModelStatic extends Model<EnvironmentModel> { }

export const Environment = mongoose.model<EnvironmentModel, EnvironmentModelStatic>('Environment', environmentSchema);
