import { Router, Response } from 'express';
import { Project, IFile } from '../models/Project';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Project templates
const getTemplate = (language: string, template: string): IFile[] => {
  const templates: Record<string, Record<string, IFile[]>> = {
    javascript: {
      blank: [
        { name: 'index.js', path: '/index.js', content: 'console.log("Hello, World!");', language: 'javascript', isFolder: false }
      ],
      node: [
        { name: 'package.json', path: '/package.json', content: '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js"\n  }\n}', language: 'json', isFolder: false },
        { name: 'index.js', path: '/index.js', content: 'const express = require(\'express\');\nconst app = express();\nconst port = 3000;\n\napp.get(\'/\', (req, res) => {\n  res.send(\'Hello World!\');\n});\n\napp.listen(port, () => {\n  console.log(`Server running at http://localhost:${port}`);\n});', language: 'javascript', isFolder: false }
      ]
    },
    python: {
      blank: [
        { name: 'main.py', path: '/main.py', content: 'print("Hello, World!")', language: 'python', isFolder: false }
      ]
    },
    html: {
      blank: [
        { name: 'index.html', path: '/index.html', content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My Project</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <h1>Hello, World!</h1>\n    <script src="script.js"></script>\n</body>\n</html>', language: 'html', isFolder: false },
        { name: 'style.css', path: '/style.css', content: 'body {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n    background-color: #f0f0f0;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}', language: 'css', isFolder: false },
        { name: 'script.js', path: '/script.js', content: 'console.log("Hello from JavaScript!");\n\n// Add your JavaScript code here', language: 'javascript', isFolder: false }
      ]
    }
  };
  
  return templates[language]?.[template] || templates.javascript.blank;
};

// Get all projects for user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user!._id },
        { collaborators: req.user!._id }
      ]
    }).populate('owner', 'username email avatar').sort({ updatedAt: -1 });

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user!._id },
        { collaborators: req.user!._id },
        { isPublic: true }
      ]
    }).populate('owner', 'username email avatar')
      .populate('collaborators', 'username email avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, language, template } = req.body;

    if (!name || !language) {
      return res.status(400).json({ message: 'Project name and language are required' });
    }

    const files = getTemplate(language, template || 'blank');

    const project = new Project({
      name,
      description,
      language,
      template: template || 'blank',
      owner: req.user!._id,
      files
    });

    await project.save();
    await project.populate('owner', 'username email avatar');

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project files
router.put('/:id/files', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { files } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user!._id },
        { collaborators: req.user!._id }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.files = files;
    await project.save();

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Update project files error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user!._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;