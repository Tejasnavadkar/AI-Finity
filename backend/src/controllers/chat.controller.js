// controllers/chat.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import "dotenv/config";
// Initialize API Clients
// Initialize Google Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Initialize OpenAI client for GroqCloud
const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Controller Functions ---
/*
 * @description Handles API calls to Google Gemini.
 * It removes the last user message from the history to use it as the new prompt.
 */

const geminiApiCallController = async (req, res) => {
  try {
    const { history } = req.body;
    if (!history || !Array.isArray(history) || history.length == 0) {
      return res
        .status(400)
        .json({ error: "Invalid or empty history provided." });
    }

    // --- Start of Modification
    // Adapt the frontend history format (e.g., {role, content})
    // to the Gemini API format (e.g., {role, parts: [{text}]})

    const geminiHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    // Per documentation, separate the latest prompt from the chat history.
    const latestMessage = geminiHistory.pop();
    if (!latestMessage || latestMessage.role !== "user") {
      return res
        .status(400)
        .json({ error: "The last item in history must be a user prompt." });
    }
    const prompt = latestMessage.parts[0].text;

    // Start a chat session with the preceding history
    const chat = geminiModel.startChat({ history: geminiHistory }); // here we send prev history for context and then send current prompt
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    res.status(200).json({ response: await response.text() });
  } catch (error) {
    res.status(400).json(`err in geminiApi:${error.message}`);
  }
};

const openaiApiCallController = async (req, res) => {
  try {
    // OpenAI-compatible APIS expect 'messages' instead of 'history'
    const { history: messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length == 0) {
      return res.status(400).json({ error: "Invalid or empty history provided." });
    }

     const result = await groqClient.chat.completions.create({
      model: "openai/gpt-oss-20b", // "gemma-7b-it"
      messages: messages
    });

    res.status(200).json({ response: result.choices[0]?.message?.content || "No content" });

  } catch (error) {
    console.log(`openAi/Groq Api Error: ${error}`)
    res.status(400).json(`err in openaiApi:${error.message}`);
  }
};

const llamaApiCallController = async (req, res) => {
  try {

    const { history: messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length == 0) {
      return res.status(400).json({ error: "Invalid or empty history provided." });
    }

     const result = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile", // "llama3-70b-8192", // Llama 3 model available on Groq
      messages: messages
    });

    res.status(200).json({ response: result.choices[0]?.message?.content || "No content" });
  } catch (error) {
    res.status(400).json(`err in llamaApi:${error.message}`);
  }
};

export default {
  geminiApiCallController,
  openaiApiCallController,
  llamaApiCallController,
};
