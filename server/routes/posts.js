import express from "express";
import { auth } from "../middleware/auth.js";
import Post from "../models/Post.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const { tag } = req.query;

    const filter = tag
      ? { tags: tag }
      : {};

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate("author", "username");

    res.json(posts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/tags", auth, async (_req, res) => {
  try {
    const tags = await Post.distinct("tags");
    res.json(tags);
  } catch (err) {
    console.error("Fetch tags error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { content, tags = [] } = req.body;
    const post = new Post({
      author: req.userId,
      content,
      tags,
      likes: [],
    });
    await post.save();
    const populated = await post.populate("author", "username");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { content, tags } = req.body;
    if (content?.trim()) post.content = content;
    if (Array.isArray(tags)) post.tags = tags;
    post.updatedAt = new Date();

    await post.save();
    const populated = await post.populate("author", "username");
    res.json(populated);
  } catch (err) {
    console.error("Update post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await post.deleteOne();
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const idx = post.likes.findIndex((uid) => uid.toString() === req.userId);
    if (idx === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes.splice(idx, 1);
    }

    await post.save();
    const populated = await post.populate("author", "username");
    res.json(populated);
  } catch (err) {
    console.error("Like post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
