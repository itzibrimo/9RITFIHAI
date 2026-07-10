import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        console.error("OPENROUTER_API_KEY is not set.");
        return res.status(500).json({ error: "API key is missing on the server." });
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // default fallback or let frontend pass it, let's use a popular model, or better yet deepseek/deepseek-chat or mistralai/mistral-7b-instruct
          messages: messages.map((msg: any) => ({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.content
          })),
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API error:", response.status, errorText);
        return res.status(response.status).json({ error: `OpenRouter error: ${response.status}` });
      }

      const data = await response.json();
      res.json({
        content: data.choices?.[0]?.message?.content || "No response received.",
      });

    } catch (error: any) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
