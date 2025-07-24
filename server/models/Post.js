// server/models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true, trim: true },
  tags:      [{ type: String, trim: true }],
  likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

export default mongoose.model('Post', postSchema);
