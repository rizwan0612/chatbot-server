import express from 'express';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' });

// Enhanced session storage
interface ChatSession {
  chat: any;
  history: Content[];
}

const chatSessions = new Map<string, ChatSession>();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post('/api/chat', limiter, async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

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