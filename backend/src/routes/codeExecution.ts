import { Router, Response } from 'express';
import axios from 'axios';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

// Language mappings for Piston API
const languageMap: Record<string, { language: string; version: string }> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  cpp: { language: 'cpp', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
  typescript: { language: 'typescript', version: '5.0.3' }
};

// Get supported languages
router.get('/languages', async (req, res) => {
  try {
    const response = await axios.get(`${PISTON_API_URL}/runtimes`);
    const runtimes = response.data;
    
    // Filter to supported languages
    const supportedLanguages = runtimes.filter((runtime: any) => 
      Object.keys(languageMap).includes(runtime.language)
    );

    res.json({
      success: true,
      languages: supportedLanguages
    });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ message: 'Failed to fetch supported languages' });
  }
});

// Execute code
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { language, code, stdin = '' } = req.body;

    if (!language || !code) {
      return res.status(400).json({ message: 'Language and code are required' });
    }

    const languageConfig = languageMap[language];
    if (!languageConfig) {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    // Prepare the execution request
    const executionRequest = {
      language: languageConfig.language,
      version: languageConfig.version,
      files: [
        {
          name: getFileName(language),
          content: code
        }
      ],
      stdin,
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1
    };

    // Execute code using Piston API
    const response = await axios.post(`${PISTON_API_URL}/execute`, executionRequest, {
      timeout: 15000
    });

    const result = response.data;

    res.json({
      success: true,
      output: {
        stdout: result.run?.stdout || '',
        stderr: result.run?.stderr || result.compile?.stderr || '',
        code: result.run?.code || result.compile?.code || 0,
        signal: result.run?.signal || null,
        language: language,
        version: languageConfig.version
      }
    });
  } catch (error) {
    console.error('Code execution error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return res.status(408).json({ message: 'Code execution timeout' });
      }
      if (error.response?.status === 400) {
        return res.status(400).json({ message: 'Invalid code or language' });
      }
    }
    
    res.status(500).json({ message: 'Failed to execute code' });
  }
});

// Helper function to get appropriate file name based on language
function getFileName(language: string): string {
  const fileNames: Record<string, string> = {
    javascript: 'main.js',
    python: 'main.py',
    cpp: 'main.cpp',
    java: 'Main.java',
    typescript: 'main.ts'
  };
  
  return fileNames[language] || 'main.txt';
}

// Test endpoint to verify Piston API connection
router.get('/test', async (req, res) => {
  try {
    const response = await axios.get(`${PISTON_API_URL}/runtimes`);
    res.json({
      success: true,
      message: 'Piston API connection successful',
      runtimeCount: response.data.length
    });
  } catch (error) {
    console.error('Piston API test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect to Piston API' 
    });
  }
});

export default router;