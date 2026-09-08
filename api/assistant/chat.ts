import type { IncomingMessage, ServerResponse } from "http";
import { GoogleGenAI } from "@google/genai";

// Fallback technical response generator if API key is not yet configured on Vercel
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

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed. Use POST." }));
    return;
  }

  try {
    let body = req.body;
    if (!body) {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      const raw = Buffer.concat(chunks).toString("utf-8");
      body = raw ? JSON.parse(raw) : {};
    }

    const { message, history, serviceContext } = body || {};
    if (!message || typeof message !== "string") {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "A message string is required." }));
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      const reply = generateLocalFallback(message, serviceContext);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          reply,
          source: "local-fallback",
          whatsappHotline: "+256 702 615 454",
        })
      );
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build-vercel",
        },
      },
    });

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

    const contextPrompt = serviceContext
      ? `[Customer is viewing the ${serviceContext} service]\nCustomer query: ${message}`
      : message;

    contents.push({
      role: "user",
      parts: [{ text: contextPrompt }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        temperature: 0.7,
        maxOutputTokens: 300,
        systemInstruction: "You are the spoken audio AI concierge for Royal Concepts in Kampala, Uganda (For: Lights, Truss, Screens, Sound and Boardwork). Keep answers concise, natural, 2-4 sentences, with no markdown bullets or stars, and mention WhatsApp at 0702 615 454.",
      },
    });

    const reply = response.text || generateLocalFallback(message, serviceContext);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        reply,
        source: "gemini-flash",
        whatsappHotline: "+256 702 615 454",
      })
    );
  } catch (error: any) {
    console.error("Vercel Chat API Error:", error);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        reply: "Our production desk at 0702 615 454 has logged your request and our lead engineer is preparing your quotation right now. Feel free to reach us directly on WhatsApp or call 0772 615 454!",
        source: "error-fallback",
        whatsappHotline: "+256 702 615 454",
      })
    );
  }
}
