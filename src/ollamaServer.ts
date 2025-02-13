import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { truncate } from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// server/src/index.ts (updated)
app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      
      const response = await axios.post(
        'http://localhost:11434/api/generate', // Ollama endpoint
        {
          model: "llama3", // Your chosen model
          content: "You are a supply chain expert. Provide detailed answers about inventory management, logistics optimization, procurement strategies, and demand forecasting. Use industry terminology and suggest actionable insights.",
          prompt: messages[messages.length - 1].content,
          stream: true, // Set to true for real-time streaming
        }
      );
  
      res.json({ content: response.data.response });
    } catch (error) {
      res.status(500).json({ error: 'Ollama Error' });
    }
  });