// server/routes/users.js
import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/users/:id — view profile
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  if (req.userId !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const user = await User.findById(id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/:id — update username/email
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  if (req.userId !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { username, email, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json({ user: updated });
  } catch (err) {
    console.error('Update user error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/users/:id — delete account
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  if (req.userId !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    await User.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;



