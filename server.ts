import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Lazy initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System instruction for Royal Concepts Audio Voice Assistant
const SYSTEM_INSTRUCTION = `You are the Royal Voice Assistant, the spoken audio AI technical concierge for Royal Concepts in Kampala, Uganda ("For: Lights, Truss, Screens, Sound and Boardwork").
A customer is currently browsing or has submitted an inquiry, and is waiting for our production team's direct response on WhatsApp (+256 702 615 454).
Your objective is to talk with them out loud, provide crisp, expert technical advice on stage production, and keep them company until our lead technician responds on WhatsApp.

CRITICAL VOICE INSTRUCTIONS:
- Keep every response concise, natural, and conversational (around 2 to 4 sentences maximum).
- Speak with confidence, hospitality, and engineering precision.
- Do NOT use Markdown bullet points, hashtags, or asterisks in your spoken output because your text is synthesized directly into human speech.
- Use clear punctuation so the text-to-speech pauses naturally.

KEY TECHNICAL FACTS & CONTACTS:
- Official WhatsApp Line: +256 702 615 454 (our crew typically replies within 10 to 20 minutes)
- Primary Dispatch Phone: 0772 615 454
- Rigging & Technical Ops: 0702 838 474
- The 5 Pillars:
  1. Lighting: 380W moving heads, Avolites Tiger Touch II DMX console, 19x15W Osram zoom washes, IP65 uplighters, and haze generators.
  2. Trussing: Heavy-duty F34 aluminum box trussing, certified 1-Ton CM Lodestar electric hoists, curved arched festival roof canopies, and line array crank towers.
  3. LED Screens: P3.91 outdoor daylight-visible video panels (5,500 nits) and P2.9 high-definition indoor displays with NovaStar 4K processors.
  4. Audio & Sound: Dual 10-inch concert line arrays, dual 18-inch ground subwoofers, Midas M32 Live 40-channel digital mixing consoles, and Shure digital wireless microphones.
  5. Stage & Boardwork: 750 kg/m² modular anti-slip stage decks, bespoke 3D CNC backlit corporate backdrops, high-gloss fashion runways, and wheelchair ramps.
- Service Area: Kampala and all major regions across Uganda and East Africa (Jinja, Entebbe, Mbarara, Gulu, Fort Portal).
- Reassure the customer that their custom quotation and equipment availability is being processed, and offer to answer questions about power requirements, dimensions, or technical setup times.`;

// Fallback technical response generator if API key is not yet configured
function generateLocalFallback(prompt: string, serviceContext?: string): string {
  const p = prompt.toLowerCase();
  
  if (p.includes("whatsapp") || p.includes("wait") || p.includes("response") || p.includes("reply") || p.includes("time")) {
    return "Our production coordinator received your request and is reviewing gear availability right now. You will receive a direct reply on WhatsApp at 0702 615 454 shortly, usually within 10 to 15 minutes. In the meantime, feel free to ask me about stage sizes, lighting fixtures, or power needs!";
  }
  
  if (p.includes("screen") || p.includes("led") || p.includes("p2.9") || p.includes("p3.9") || p.includes("display")) {
    return "For indoor corporate conferences, we recommend our P2.9 high-definition screen for crystal-clear text up close. For outdoor festivals and open-air concerts, our P3.91 outdoor panels deliver 5,500 nits of brightness to combat direct equatorial sunlight. We calibrate every wall with NovaStar 4K video processors.";
  }

  if (p.includes("light") || p.includes("beam") || p.includes("wash") || p.includes("dmx") || p.includes("moving head")) {
    return "Our lighting inventory features high-output 380W moving heads, 19 by 15W Osram zoom wash fixtures, and wireless IP65 battery uplighters. Everything is programmed on Avolites Tiger Touch 2 consoles with smooth fade transitions and dynamic show timecode.";
  }

  if (p.includes("sound") || p.includes("audio") || p.includes("speaker") || p.includes("mic") || p.includes("line array")) {
    return "For concert and gala sound, we deploy dual 10-inch line arrays flown on structural towers, accompanied by dual 18-inch subwoofers. Mixing is handled on our Midas M32 digital console paired with interference-free Shure ULX-D wireless microphones.";
  }

  if (p.includes("truss") || p.includes("rigging") || p.includes("roof") || p.includes("hoist")) {
    return "Safety is paramount at Royal Concepts. We use certified F34 heavy-duty aluminum box truss with CM Lodestar 1-Ton electric chain hoists and secondary safety steel cables. Every flown structure includes certified structural load calculations.";
  }

  if (p.includes("stage") || p.includes("boardwork") || p.includes("backdrop") || p.includes("runway") || p.includes("size")) {
    return "Our modular stage decks are certified for 750 kilograms per square meter with anti-slip hexagrip surfaces. We also craft custom 3D CNC wooden backdrops with integrated LED ribbon lighting and high-gloss fashion runways.";
  }

  if (p.includes("price") || p.includes("cost") || p.includes("rate") || p.includes("quote") || p.includes("deposit")) {
    return "Event packages are tailored to your venue size, technician hours, and hardware configuration. A typical indoor corporate gala starts with full sound, lighting, and a P2.9 screen, and our production manager will send you an itemized budget on WhatsApp at 0702 615 454.";
  }

  if (p.includes("location") || p.includes("jinja") || p.includes("entebbe") || p.includes("gulu") || p.includes("uganda")) {
    return "Royal Concepts is based in Kampala, but our logistics fleet routinely deploys across all regions of Uganda and East Africa, including Entebbe, Jinja, Mbarara, and cross-border productions.";
  }

  return `Welcome to Royal Concepts! While our team reviews your message on WhatsApp at 0702 615 454, I am here to assist with any questions regarding our lights, trussing, LED screens, sound systems, or custom stage boardwork. What details can I help you calculate?`;
}

// Interactive Audio Bot Chat Endpoint
app.post("/api/assistant/chat", async (req, res) => {
  try {
    const { message, history, serviceContext } = req.body;
    
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "A message string is required." });
    }

    const ai = getGenAI();

    if (!ai) {
      // Return high-quality domain fallback response
      const fallbackText = generateLocalFallback(message, serviceContext);
      return res.json({
        reply: fallbackText,
        source: "local-assistant",
        whatsappHotline: "+256 702 615 454",
      });
    }

    // Prepare contents array for Gemini
    const contents: any[] = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item && item.text) {
          contents.push({
            role: item.role === "assistant" || item.role === "model" ? "model" : "user",
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Add current user prompt
    const contextPrompt = serviceContext 
      ? `[Customer is currently viewing the ${serviceContext} service section]\nCustomer query: ${message}`
      : message;

    contents.push({
      role: "user",
      parts: [{ text: contextPrompt }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 250,
      },
    });

    const replyText = response.text || generateLocalFallback(message, serviceContext);

    return res.json({
      reply: replyText.trim(),
      source: "gemini-3.8-flash",
      whatsappHotline: "+256 702 615 454",
    });
  } catch (error: any) {
    console.error("Error in /api/assistant/chat:", error);
    // Graceful fallback on any API error
    const fallbackText = generateLocalFallback(req.body?.message || "", req.body?.serviceContext);
    return res.json({
      reply: fallbackText,
      source: "fallback",
      whatsappHotline: "+256 702 615 454",
    });
  }
});

// Summarize chat conversation and format for WhatsApp transmission
app.post("/api/assistant/summarize", async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const userQueries = messages
      .filter((m: any) => m.sender === "user")
      .map((m: any) => m.text);

    const fullTranscript = messages
      .filter((m: any) => m.id !== "welcome-1")
      .map((m: any) => `${m.sender === "user" ? "Client" : "Royal Voice AI"}: ${m.text}`)
      .join("\n");

    const ai = getGenAI();

    let summaryText = "";
    let spokenRecap = "I have summarized our discussion into a complete technical event brief and forwarded it to our WhatsApp operations desk at 0702 615 454.";

    if (ai && userQueries.length > 0) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Please summarize this client staging consultation into a WhatsApp event brief for our operations crew:

${fullTranscript}

Format:
*ROYAL CONCEPTS - EVENT INQUIRY & CHAT SUMMARY*
📅 Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}

📋 *Client Requirements*:
[Brief summary of what client needs]

🛠 *Recommended Gear & Specifications*:
[Staging, lighting, trussing, screens, sound]

📞 *Next Step*:
[Direct follow-up instructions on WhatsApp +256 702 615 454]`,
                },
              ],
            },
          ],
          config: {
            systemInstruction: "You are the technical production director for Royal Concepts in Kampala, Uganda (+256 702 615 454). Output only the formatted WhatsApp message text ready to be sent directly to the customer and crew on WhatsApp. Use asterisks for bold.",
            temperature: 0.3,
            maxOutputTokens: 1000,
          },
        });

        if (response.text) {
          summaryText = response.text.trim();
        }
      } catch (err) {
        console.warn("AI summary generation error, falling back to local formatter:", err);
      }
    }

    // High quality local fallback summary if AI unavailable or no query
    if (!summaryText) {
      const questionsList = userQueries.length > 0
        ? userQueries.map((q: string) => `• ${q}`).join("\n")
        : "• Technical equipment inquiry and staging consultation";

      summaryText = `*ROYAL CONCEPTS - EVENT BRIEF & CHAT SUMMARY*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}

📋 *Client Inquiries & Specifications Discussed*:
${questionsList}

🛠 *Production Pillars Explored*:
• Staging, Rigging & Structural Trussing
• Intelligent Lighting & DMX Show Control
• High-Definition LED Screens (P2.9 Indoor / P3.9 Outdoor)
• Concert Line Array Pro Sound & Microphones

📞 *Next Step*:
Please review availability and reply on WhatsApp with gear confirmation and schedule.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Forwarded from Royal Concepts Voice Assistant to WhatsApp Desk (+256 702 615 454)._`;
    }

    const cleanPhone = "256702615454";
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(summaryText)}`;

    return res.json({
      summary: summaryText,
      spokenRecap,
      whatsappUrl,
      whatsappHotline: "+256 702 615 454",
    });
  } catch (error: any) {
    console.error("Error in /api/assistant/summarize:", error);
    const basicSummary = `*ROYAL CONCEPTS - EVENT INQUIRY SUMMARY*\n\nHello Royal Concepts, I just spoke with your AI Voice Assistant and would like to follow up regarding staging and equipment availability.\n\nWhatsApp Desk: +256 702 615 454`;
    return res.json({
      summary: basicSummary,
      spokenRecap: "I have forwarded your chat summary to our WhatsApp desk at 0702 615 454.",
      whatsappUrl: `https://wa.me/256702615454?text=${encodeURIComponent(basicSummary)}`,
      whatsappHotline: "+256 702 615 454",
    });
  }
});

// Vite middleware & Production static serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Royal Concepts Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
