// src/routes/entries.ts
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth';
import BlogEntry, { IBlogEntry } from '../Models/BlogEntry';

const router = express.Router();

// Alle Blog-Einträge abrufen
router.get('/', async (req: Request, res: Response) => {
  try {
    const entries = await BlogEntry.find()
      .populate('authors', 'username firstName lastName')
      .populate('category', 'name');
    
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Einen bestimmten Blog-Eintrag abrufen
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const entry = await BlogEntry.findById(req.params.id)
      .populate('authors', 'username firstName lastName')
      .populate('category', 'name');
    
    if (!entry) {
      return res.status(404).json({ message: 'Blog entry not found' });
    }
    
    // Impressions erhöhen
    entry.impressionCount += 1;
    await entry.save();
    
    res.json(entry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Neuen Blog-Eintrag erstellen
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      content, 
      category, 
      commentsAllowed, 
      images, 
      links, 
      hashtags,
      predictions 
    } = req.body;
    
    const newEntry = new BlogEntry({
      title,
      authors: [req.user?.id], // Aktueller Benutzer als Autor
      description,
      content,
      category,
      commentsAllowed: commentsAllowed !== undefined ? commentsAllowed : true,
      images: images || [],
      links: links || [],
      hashtags: hashtags || [],
      predictions: predictions || []
    });
    
    await newEntry.save();
    
    const populatedEntry = await BlogEntry.findById(newEntry._id)
      .populate('authors', 'username firstName lastName')
      .populate('category', 'name');
    
    res.status(201).json(populatedEntry);
  } catch (error: any) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'A blog entry with this title already exists for this author' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Blog-Eintrag aktualisieren oder erstellen (upsert)
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      content, 
      category, 
      commentsAllowed, 
      images, 
      links, 
      hashtags,
      predictions 
    } = req.body;
    
    // Aktualisierte Daten
    const updatedData: any = {
      title,
      description,
      content,
      category,
      $push: { editDates: new Date() }
    };
    
    if (commentsAllowed !== undefined) updatedData.commentsAllowed = commentsAllowed;
    if (images) updatedData.images = images;
    if (links) updatedData.links = links;
    if (hashtags) updatedData.hashtags = hashtags;
    if (predictions) updatedData.predictions = predictions;
    
    const options = { 
      new: true, // Return the updated document
      upsert: true, // Create document if it doesn't exist
      runValidators: true,
      setDefaultsOnInsert: true
    };
    
    const entry = await BlogEntry.findByIdAndUpdate(
      req.params.id,
      updatedData,
      options
    ).populate('authors', 'username firstName lastName')
     .populate('category', 'name');
    
    res.json(entry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Author zu einem Blog-Eintrag hinzufügen oder ändern
router.patch('/:id/authors', auth, async (req: Request, res: Response) => {
  try {
    const { authorId } = req.body;
    const entry = await BlogEntry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: 'Blog entry not found' });
    }
    
    // Prüfen, ob der angegebene Author existiert
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ message: 'Invalid author ID' });
    }
    
    if (entry.authors.length > 1) {
      // Falls mehrere Autoren unterstützt werden, füge den neuen Autor hinzu
      if (!entry.authors.includes(authorId)) {
        entry.authors.push(authorId);
      }
    } else {
      // Falls nur ein Autor unterstützt wird, ersetze ihn
      entry.authors = [authorId];
    }
    
    entry.editDates.push(new Date());
    await entry.save();
    
    const updatedEntry = await BlogEntry.findById(entry._id)
      .populate('authors', 'username firstName lastName')
      .populate('category', 'name');
    
    res.json(updatedEntry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Blog-Eintrag löschen (mit zugehörigen Kommentaren)
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    // Blog-Eintrag löschen
    const entry = await BlogEntry.findByIdAndDelete(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: 'Blog entry not found' });
    }
    
    // Zugehörige Kommentare löschen
    await mongoose.model('Comment').deleteMany({ entryId: req.params.id });
    
    res.json({ message: 'Blog entry and associated comments deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Neuesten Blog-Eintrag mit einem Hashtag erweitern
router.patch('/latest/hashtag', auth, async (req: Request, res: Response) => {
  try {
    const { hashtag } = req.body;
    
    if (!hashtag) {
      return res.status(400).json({ message: 'Hashtag is required' });
    }
    
    // Neuesten Blog-Eintrag finden
    const latestEntry = await BlogEntry.findOne()
      .sort({ creationDate: -1 });
    
    if (!latestEntry) {
      return res.status(404).json({ message: 'No blog entries found' });
    }
    
    // Hashtag hinzufügen, wenn er noch nicht existiert
    if (!latestEntry.hashtags.includes(hashtag)) {
      latestEntry.hashtags.push(hashtag);
      latestEntry.editDates.push(new Date());
      await latestEntry.save();
    }
    
    const updatedEntry = await BlogEntry.findById(latestEntry._id)
      .populate('authors', 'username firstName lastName')
      .populate('category', 'name');
    
    res.json(updatedEntry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Alle Blog-Einträge eines bestimmten Benutzers abrufen
router.get('/user/:username', async (req: Request, res: Response) => {
  try {
    // Benutzer anhand des Benutzernamens finden
    const user = await mongoose.model('User').findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Blog-Einträge dieses Benutzers finden
    const entries = await BlogEntry.find({ authors: user._id })
      .populate('authors', 'username firstName lastName')
      .populate('category', 'name');
    
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Die neuesten 2 Blog-Einträge abrufen
router.get('/latest/two', async (req: Request, res: Response) => {
  try {
    const entries = await BlogEntry.find()
      .sort({ creationDate: -1 })
      .limit(2)
      .populate('authors', 'username firstName lastName')
      .populate('category', 'name');
    
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Der zweitälteste Blog-Eintrag
router.get('/oldest/second', async (req: Request, res: Response) => {
  try {
    const entries = await BlogEntry.find()
      .sort({ creationDate: 1 })
      .skip(1)
      .limit(1)
      .populate('authors', 'username firstName lastName')
      .populate('category', 'name');
    
    if (entries.length === 0) {
      return res.status(404).json({ message: 'No blog entry found' });
    }
    
    res.json(entries[0]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Alle Blog-Einträge mit mehr als einem Bild
router.get('/with/multiple-images', async (req: Request, res: Response) => {
  try {
    const entries = await BlogEntry.find({ 'images.1': { $exists: true } })
      .populate('authors', 'username firstName lastName')
      .populate('category', 'name');
    
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Alle Blog-Einträge der letzten Woche, die einen Link enthalten
router.get('/recent/with-links', async (req: Request, res: Response) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const entries = await BlogEntry.find({ 
      creationDate: { $gte: oneWeekAgo },
      'links.0': { $exists: true }
    })
    .populate('authors', 'username firstName lastName')
    .populate('category', 'name');
    
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Alle Blog-Einträge, bei denen der Titel im Inhalt erwähnt wird
router.get('/title-in-content', async (req: Request, res: Response) => {
  try {
    // Hinweis: Dies ist ein einfacher Ansatz, der nur auf exakte Übereinstimmungen prüft
    // Für komplexere Text-Matching müsste man ein Text-Indexierung oder Regex verwenden
    const entries = await BlogEntry.find();
    
    const filteredEntries = entries.filter(entry => 
      entry.content.includes(entry.title)
    );
    
    const populatedEntries = await BlogEntry.populate(filteredEntries, [
      { path: 'authors', select: 'username firstName lastName' },
      { path: 'category', select: 'name' }
    ]);
    
    res.json(populatedEntries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;