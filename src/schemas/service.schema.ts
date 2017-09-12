import { Schema } from 'mongoose';

export let serviceSchema: Schema = new Schema({
  environmentId: String,
  serviceName: String,
  displayName: String,
  type: String,
});
