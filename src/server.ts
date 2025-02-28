import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' });

// Context storage (use Redis/MongoDB in production)
const chatSessions = new Map<string, any>();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Create/Continue chat session
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    // Get or create session
    let chat = chatSessions.get(sessionId);
    if (!chat) {
      chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "You are a customer support agent for an e-commerce company. Keep responses professional and focused on resolving issues." }]
          },
          {
            role: "model",
            parts: [{ text: "Understood. I'm ready to assist with any customer inquiries." }]
          }
        ],
        generationConfig: { maxOutputTokens: 1000 }
      });
      chatSessions.set(sessionId, chat);
    }

    // Send message with context
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });

  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));