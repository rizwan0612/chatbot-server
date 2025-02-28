import express from 'express';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' });

// Enhanced session storage
interface ChatSession {
  chat: any;
  history: Content[];
}



const chatSessions = new Map<string, ChatSession>();

// Zod validation schema
const chatSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(1000)
});

// Configure CORS properly
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post('/api/chat', limiter, async (req, res) => {
  try {

    // Validate request body
    const validation = chatSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request format',
        details: validation.error.issues
      });
    }

    const { sessionId, message } = validation.data;


    // Get or create session
    let session = chatSessions.get(sessionId);
    if (!session) {
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "You are a helpful assistant. Keep responses concise and relevant." }]
          },
          {
            role: "model",
            parts: [{ text: "Understood! How can I assist you today?" }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.9
        }
      });

      session = {
        chat,
        history: []
      };
      chatSessions.set(sessionId, session);
    }

    // Add user message to history
    session.history.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Send message
    const result = await session.chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // Add model response to history
    session.history.push({
      role: 'model',
      parts: [{ text }]
    });

    res.json({ text });

  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      details: error.message,
      validationErrors: error?.response?.validationErrors
    });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));