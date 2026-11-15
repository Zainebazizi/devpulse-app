// models/Log.js
//import mongoose from 'mongoose';

//const LogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: String, default: 'info' }, // consider renaming to `section` for honesty
  message: { type: String, required: true },
  hours: { type: Number, min: 0, default: 0 },
  createdAt: { type: Date, default: Date.now },
//});

//export default mongoose.model('Log', LogSchema);