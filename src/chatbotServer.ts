import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DEEPSEEK_API_KEY = 'Bearer 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';


const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  //content: "You are a supply chain expert. Provide detailed answers about inventory management, logistics optimization, procurement strategies, and demand forecasting. Use industry terminology and suggest actionable insights.",
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku about ai"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));

// app.post('/api/chat', async (req: Request, res: Response) => {
//   try {
//     const userMessage = req.body.message;
    
//     const response = await axios.post(
//       'https://api.deepseek.com/v1/chat/completions',
//       {
//         model: "deepseek-chat",
//         messages: [
//           {
//             role: "system",
//             content: "You are a supply chain expert. Provide detailed answers about inventory management, logistics optimization, procurement strategies, and demand forecasting. Use industry terminology and suggest actionable insights."
//           },
//           {
//             role: "user",
//             content: userMessage
//           }
//         ],
//         temperature: 0.7,
//         max_tokens: 500
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     res.json({
//       reply: response.data.choices[0].message.content
//     });

//   } catch (error) {
//     console.error('DeepSeek API Error:', error);
//     res.status(500).json({ error: 'Chat processing failed' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // server/src/index.ts (updated)
// app.post('/api/chat', async (req, res) => {
//     try {
//       const { messages } = req.body;
      
//       const response = await axios.post(
//         'http://localhost:11434/api/generate', // Ollama endpoint
//         {
//           model: "llama3", // Your chosen model
//           content: "You are a supply chain expert. Provide detailed answers about inventory management, logistics optimization, procurement strategies, and demand forecasting. Use industry terminology and suggest actionable insights.",
//           prompt: messages[messages.length - 1].content,
//           stream: false, // Set to true for real-time streaming
//         }
//       );
  
//       res.json({ content: response.data.response });
//     } catch (error) {
//       res.status(500).json({ error: 'Ollama Error' });
//     }
//   });