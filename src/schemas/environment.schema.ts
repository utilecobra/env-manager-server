import { Schema } from 'mongoose';

export let environmentSchema: Schema = new Schema({
  displayName: String,
  host: String,
});
