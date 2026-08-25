const express = require('express');
const Issue = require('../models/Issue');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all issues for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const issues = await Issue.find({ project: req.params.projectId })
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create issue
router.post('/', auth, async (req, res) => {
  try {
    const { summary, description, type, priority, project, assignee, labels, storyPoints, dueDate } = req.body;
    
    const projectData = await Project.findById(project);
    if (!projectData) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Generate issue key
    const count = await Issue.countDocuments({ project });
    const key = `${projectData.key}-${count + 1}`;
    
    const issue = new Issue({
      key,
      summary,
      description,
      type,
      priority,
      project,
      assignee,
      reporter: req.user.userId,
      labels,
      storyPoints,
      dueDate,
    });
    
    await issue.save();
    await issue.populate('assignee', 'name email avatar');
    await issue.populate('reporter', 'name email avatar');
    
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get issue by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('comments.author', 'name email avatar');
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update issue
router.patch('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar');
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    issue.comments.push({
      author: req.user.userId,
      text,
    });
    
    await issue.save();
    await issue.populate('comments.author', 'name email avatar');
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
