import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgentRole, HistoricalFigure } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Select model based on complexity (per coding guidelines)
// Using gemini-3-pro-preview for complex reasoning and structured output
const MODEL_NAME = 'gemini-3-pro-preview';

/**
 * Orchestrates the agent workflow.
 */
export const runAgentOperation = async (
  agent: AgentRole,
  figure: HistoricalFigure,
  userIntent: string,
  contextHistory: string[] = []
): Promise<string> => {
  
  let systemInstruction = "";

  switch (agent) {
    case AgentRole.G2:
      systemInstruction = `
        Eres el Agente G2 (Inteligencia) del sistema LA LECHUZA.
        Tu misión: Analizar la figura histórica de ${figure.name}.
        Metodología:
        1. Realiza un perfilado psicométrico rápido (OCEAN) basado en su bio: ${figure.bio}.
        2. Identifica "Pain Points" culturales actuales con los que su vida resuena.
        3. Detecta oportunidades de narrativa oculta.
        Salida: Sé conciso, analítico y directo. Usa formato militar/técnico.
      `;
      break;
    case AgentRole.G3:
      systemInstruction = `
        Eres el Agente G3 (Estrategia) del sistema LA LECHUZA.
        Tu misión: Construir una estrategia de campaña para ${figure.name}.
        Intención del usuario: ${userIntent}.
        Metodología:
        1. Define el objetivo principal (Visibilidad, Reivindicación, Polémica).
        2. Simula un "War Game": ¿Qué obstáculos enfrentará esta narrativa hoy?
        3. Asigna canales de ataque (Twitter hilos, Instagram visual, LinkedIn académico).
        Salida: Plan estratégico estructurado.
      `;
      break;
    case AgentRole.G4:
      systemInstruction = `
        Eres el Agente G4 (Creatividad/Comunicaciones) del sistema LA LECHUZA.
        Tu misión: Crear el contenido para ${figure.name}.
        Metodología:
        1. Genera Hooks (Ganchos) virales.
        2. Define la estética visual (Prompts de arte).
        3. Redacta copys persuasivos adaptados a la audiencia moderna.
        Salida: Lista de ideas creativas y assets textuales.
      `;
      break;
    case AgentRole.G5:
      systemInstruction = `
        Eres el Agente G5 (Contra-Inteligencia/PR) del sistema LA LECHUZA.
        Tu misión: Proteger la narrativa de ${figure.name} y prevenir crisis.
        Bio: ${figure.bio}.
        Metodología:
        1. Detecta posibles puntos de controversia (política, religión, acciones pasadas).
        2. Diseña estrategias de inoculación (cómo responder antes de que ataquen).
        3. Evalúa la recepción ética en el siglo XXI.
        Salida: Informe de riesgos y protocolos de respuesta.
      `;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        ...contextHistory.map(txt => ({ role: 'user', parts: [{ text: txt }] })),
        { role: 'user', parts: [{ text: `INFORME REQUERIDO: ${userIntent}` }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 1024 } // Use thinking for depth
      }
    });

    return response.text || "Error: No intelligence data received.";
  } catch (error) {
    console.error("Agent Operation Failed:", error);
    return `[SYSTEM FAILURE] Agent ${agent} offline. Connection error.`;
  }
};

/**
 * Generates the Strategy Matrix (10 Avatars vs 10 Angles)
 */
export const generateStrategyMatrix = async (figure: HistoricalFigure, intent: string) => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      avatars: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            demographic: { type: Type.STRING },
            psychographic: { type: Type.STRING },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      },
      angles: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            tone: { type: Type.STRING },
            narrativeFocus: { type: Type.STRING },
            keyMessage: { type: Type.STRING }
          }
        }
      }
    },
    required: ["avatars", "angles"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Genera una Matriz de Estrategia para la figura: ${figure.name}.
      Bio: ${figure.bio}.
      Intención de campaña: ${intent}.
      
      Necesito 5 Avatares de audiencia (Buyer Personas detallados) y 5 Ángulos de Candidato (Voces de marca distintas) que resuenen con esta figura.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Matrix Gen Error:", error);
    return { avatars: [], angles: [] };
  }
};

/**
 * Generates Viral Payloads (Specific Content Pieces)
 */
export const generateViralPayloads = async (figure: HistoricalFigure, angle: string, avatar: string) => {
   const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      payloads: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING, description: "First 3 seconds text/audio" },
            trigger: { type: Type.STRING, description: "Psychological trigger used" },
            visualPrompt: { type: Type.STRING, description: "AI Image prompt description" },
            format: { type: Type.STRING, enum: ["Reel", "Carousel", "Thread", "Story"] },
            caption: { type: Type.STRING, description: "Social media caption" }
          }
        }
      }
    }
   };

   try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Genera 3 'Cargas Virales' (Contenido de alto impacto) para:
      Figura: ${figure.name}
      Dirigido a: ${avatar}
      Usando el ángulo: ${angle}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "{}");
   } catch (error) {
     return { payloads: [] };
   }
}
