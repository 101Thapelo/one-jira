const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name email')
      .populate('team', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const { name, key, description, category } = req.body;
    
    const project = new Project({
      name,
      key,
      description,
      category,
      owner: req.user.userId,
    });
    
    await project.save();
    await project.populate('owner', 'name email');
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('team', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project
router.patch('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    Object.assign(project, req.body);
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
