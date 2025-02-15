import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'; //Import GenerativeModel
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

const apiKey = process.env.GEMINI_API_KEY; // Get API key from environment variables

if (!apiKey) {
    console.error("GEMINI_API_KEY is missing.  Set it in your .env file.");
    process.exit(1); // Exit if the API key is not set
}

const genAI = new GoogleGenerativeAI(apiKey);

// Call getModel as a method on the genAI instance, and explicitly specify the type
const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-pro"});

app.post('/api/generate', async (req: Request, res: Response) => {
    try {
        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const result = await model.generateContent(prompt); // Use the model instance
        const responseText = result.response.text();
        res.json({ response: responseText });

    } catch (error: any) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: `Failed to generate content: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});