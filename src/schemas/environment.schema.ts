import { Schema } from 'mongoose';

export var environmentSchema: Schema = new Schema({
  displayName: String,
  host: String
});
