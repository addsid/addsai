import express from "express";
import cors from "cors";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: prompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const parts = response.candidates[0].content.parts;
  const imagePart = parts.find((part) => part.inlineData);

  if (imagePart) {
    res.json({ image: `data:image/png;base64,${imagePart.inlineData.data}` });
  } else {
    res.status(500).json({ error: "No image generated." });
  }
});

app.post("/chat", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate chat response" });
  }
});



app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${port}`);
});

