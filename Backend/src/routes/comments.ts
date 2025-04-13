// src/routes/comments.ts
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth';
import Comment from '../Models/Comment';
import BlogEntry from '../Models/BlogEntry';

const router = express.Router();

// Alle Kommentare zu einem Blog-Eintrag abrufen
router.get('/entry/:entryId', async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ entryId: req.params.entryId })
      .populate('author', 'username firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Neuen Kommentar erstellen
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { entryId, content } = req.body;
    
    // Prüfen, ob der Blog-Eintrag existiert und Kommentare erlaubt
    const entry = await BlogEntry.findById(entryId);
    
    if (!entry) {
      return res.status(404).json({ message: 'Blog entry not found' });
    }
    
    if (!entry.commentsAllowed) {
      return res.status(403).json({ message: 'Comments are not allowed for this blog entry' });
    }
    
    const newComment = new Comment({
      entryId,
      author: req.user?.id,
      content
    });
    
    await newComment.save();
    
    const populatedComment = await Comment.findById(newComment._id)
      .populate('author', 'username firstName lastName');
    
    res.status(201).json(populatedComment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Die 2 neuesten Kommentare zu Blog-Einträgen eines bestimmten Benutzers
router.get('/latest/user/:username', async (req: Request, res: Response) => {
  try {
    // Benutzer finden
    const user = await mongoose.model('User').findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Blog-Einträge des Benutzers finden
    const entries = await BlogEntry.find({ authors: user._id });
    
    if (entries.length === 0) {
        return res.status(404).json({ message: 'No blog entries found for this user' });
      }
      
      // Eintrag-IDs extrahieren
      const entryIds = entries.map(entry => entry._id);
      
      // Die 2 neuesten Kommentare zu diesen Einträgen finden
      const comments = await Comment.find({ entryId: { $in: entryIds } })
        .populate('author', 'username firstName lastName')
        .populate('entryId', 'title')
        .sort({ createdAt: -1 })
        .limit(2);
      
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Kommentar löschen
  router.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
      const comment = await Comment.findById(req.params.id);
      
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      
      // Prüfen, ob der Benutzer der Autor des Kommentars ist
      if (comment.author.toString() !== req.user?.id) {
        return res.status(403).json({ message: 'You can only delete your own comments' });
      }
      
      await comment.deleteOne();
      res.json({ message: 'Comment deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  export default router;
        