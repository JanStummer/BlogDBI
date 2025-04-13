// src/routes/categories.ts
import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import Category from '../Models/Category';

const router = express.Router();

// Alle Kategorien abrufen
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Eine bestimmte Kategorie abrufen
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Neue Kategorie erstellen
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    const newCategory = new Category({
      name,
      description
    });
    
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Kategorie aktualisieren
router.patch('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    if (name) category.name = name;
    if (description) category.description = description;
    
    await category.save();
    res.json(category);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;