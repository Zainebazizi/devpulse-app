
import Log from '../models/Log.js';
import asyncHandler from '../middleware/asyncHandler.js';


export const getLogs = asyncHandler (async (req, res) => {
  
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
});


export const getLogById = asyncHandler(async (req, res) => {

    const log = await Log.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  
})


export const createLog = asyncHandler(async (req, res) => {
  
    const { title, level, message, hours } = req.body;
    const newLog = new Log({ title, level, message, hours });
    await newLog.save();
    res.status(201).json(newLog);
 
});


export const updateLog = asyncHandler(async (req, res) => {
  
    const updatedLog = await Log.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedLog) return res.status(404).json({ message: 'Log not found' });
    res.json(updatedLog);
  
});


export const deleteLog = asyncHandler(  async (req, res) => {

    const deletedLog = await Log.findByIdAndDelete(req.params.id);
    if (!deletedLog) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted successfully', id: req.params.id });
  
});