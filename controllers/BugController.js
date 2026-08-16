
import Bug from '../models/Bug.js';
import asyncHandler from '../middleware/asyncHandler.js';



export const getBugs = asyncHandler(async (req, res) => {
  const { search } = req.query;
  
  let query = {};   


if (search) {
  query = { title: { $regex: search, $options: 'i' } };
}

  const bugs = await Bug.find(query).sort({ createdAt: -1 });
  res.json(bugs);
});


export const getBugById = asyncHandler(async (req, res) => {
  const singleBug = await Bug.findById(req.params.id);
  if (!singleBug) return res.status(404).json({ message: 'Bug not found' });
  res.json(singleBug);
});



export const createBug = asyncHandler(async (req, res) => {
  const { title, session, originalError, solution, rating, priority, status } = req.body;
  const newBug = new Bug({ title, session, originalError, solution, rating, priority, status });
  await newBug.save();
  res.status(201).json(newBug);
});

export const updateBug = asyncHandler(async (req, res) => {
  const updatedBug = await Bug.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedBug) return res.status(404).json({ message: 'Bug not updated' });
  res.json(updatedBug);
});


export const deleteBug = asyncHandler(  async (req, res) => {
  
    const deletedBug = await Bug.findByIdAndDelete(req.params.id);
    if (!deletedBug) return res.status(404).json({ message: 'Bug not found' });
    res.json({ message: 'Bug deleted successfully', id: req.params.id });
 
  });
