import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgentRole, HistoricalFigure, CronoConfig } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Select model based on complexity
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
        Eres el Agente G2 (Contexto e Investigación) del Observatorio Cultural LA LECHUZA.
        Tu misión: Analizar la figura histórica de ${figure.name} desde una perspectiva sociológica y cultural.
        Metodología:
        1. Contextualiza su vida en las redes de influencia de la Europa de entreguerras.
        2. Identifica temas universales en su biografía que resuenen con la sensibilidad contemporánea (ej. exilio, resistencia, identidad, arte y sociedad).
        3. Realiza un perfilado de "Capital Cultural": ¿Qué valores simbólicos representa esta figura hoy?
        
        FORMATO DE SALIDA (MARKDOWN):
        Usa encabezados (#, ##) para estructurar el análisis. Usa negritas para conceptos clave.
        Se conciso pero profundo.
      `;
      break;
    case AgentRole.G3:
      systemInstruction = `
        Eres el Agente G3 (Estrategia de Difusión) del Observatorio Cultural LA LECHUZA.
        Tu misión: Diseñar una estrategia de divulgación para la vida y obra de ${figure.name}.
        Intención del usuario: ${userIntent}.
        Metodología:
        1. Define el objetivo cultural (Revalorización histórica, Conciencia educativa, Debate ético).
        2. Simula la recepción sociológica: ¿Cómo interpretarán esta figura los distintos estratos culturales actuales?
        3. Propone canales de mediación (Exposiciones digitales, Hilos documentales, Podcast narrativo).
        
        FORMATO DE SALIDA (MARKDOWN):
        Estructura el plan estratégicamente. Usa listas y viñetas.
      `;
      break;
    case AgentRole.G4:
      systemInstruction = `
        Eres el Agente G4 (Narrativa y Estética) del Observatorio Cultural LA LECHUZA.
        Tu misión: Diseñar los artefactos narrativos para comunicar la historia de ${figure.name}.
        Metodología:
        1. Conceptualiza "Ganchos Narrativos" basados en la emoción humana y la curiosidad intelectual.
        2. Define una dirección de arte para los materiales visuales (Estilo de archivo, collage dadaísta, reconstrucción histórica).
        3. Redacta fragmentos de guion o texto que prioricen la profundidad y la belleza sobre el "clickbait".
        
        FORMATO DE SALIDA (MARKDOWN):
        Presenta las ideas de forma clara y visualmente distinguida.
      `;
      break;
    case AgentRole.G5:
      systemInstruction = `
        Eres el Agente G5 (Crítica y Ética) del Observatorio Cultural LA LECHUZA.
        Tu misión: Asegurar la integridad histórica y ética en la representación de ${figure.name}.
        Bio: ${figure.bio}.
        Metodología:
        1. Identifica riesgos de anacronismo o simplificación excesiva.
        2. Evalúa la sensibilidad ética de los temas tratados (guerra, holocausto, política) en el contexto actual.
        3. Propone matices necesarios para mantener el rigor académico sin perder accesibilidad.
        
        FORMATO DE SALIDA (MARKDOWN):
        Usa advertencias y recomendaciones claras.
      `;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        ...contextHistory.map(txt => ({ role: 'user', parts: [{ text: txt }] })),
        { role: 'user', parts: [{ text: `CONSULTA DE DIFUSIÓN: ${userIntent}` }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    return response.text || "Error: No data received.";
  } catch (error) {
    console.error("Agent Operation Failed:", error);
    return `[SYSTEM FAILURE] Agent ${agent} offline. Connection error.`;
  }
};

/**
 * Generates the Strategy Matrix
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
            culturalInterest: { type: Type.STRING },
            sociologicalProfile: { type: Type.STRING },
            engagementBarriers: { type: Type.ARRAY, items: { type: Type.STRING } }
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
            pedagogicalApproach: { type: Type.STRING },
            coreValue: { type: Type.STRING }
          }
        }
      }
    },
    required: ["avatars", "angles"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Genera una Matriz de Resonancia Sociológica para la figura: ${figure.name}. Bio: ${figure.bio}. Intención: ${intent}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { avatars: [], angles: [] };
  }
};

/**
 * Generates Viral Payloads
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
            hook: { type: Type.STRING },
            educationalValue: { type: Type.STRING },
            visualConcept: { type: Type.STRING },
            format: { type: Type.STRING, enum: ["Micro-Documentary", "Digital Archive", "Narrative Thread", "Visual Essay"] },
            context: { type: Type.STRING }
          }
        }
      }
    }
   };

   try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Genera 3 Artefactos Narrativos para ${figure.name}, Arquetipo: ${avatar}, Voz: ${angle}`,
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

/**
 * Auto-configures the Cronoposting form based on natural language prompt
 */
export const autoConfigureCronoposting = async (figure: HistoricalFigure, magicPrompt: string): Promise<Partial<CronoConfig>> => {
    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            duration: { type: Type.STRING },
            frequency: { type: Type.STRING },
            tone: { type: Type.STRING },
            contentMix: { type: Type.STRING },
            kpi: { type: Type.STRING },
            productionLevel: { type: Type.STRING },
            platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
            formats: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicGoal: { type: Type.STRING }
        }
    };

    // Valid options for mapping
    const validOptions = `
    Duration: "1 Semana (Blitz)", "1 Mes (Sostenimiento)", "3 Meses (Campaña Trimestral)"
    Frequency: "Baja (Calidad/Ensayo)", "Media (Constancia)", "Alta (Dominancia Algoritmo)"
    Tone: "Didáctico / Accesible", "Solemne / Académico", "Provocador / Crítico", "Emotivo / Memoria"
    Mix: "Regla 70/20/10 (Valor/Debate/Promo)", "Storytelling Puro (Narrativa)", "Archivo Documental (Evidencia)"
    KPI: "Adhesión Cultural (Engagement)", "Alcance (Viralidad)", "Profundidad (Lectura/Retención)"
    Production: "Bajo (Solo Texto/IA)", "Medio (Híbrido IA/Archivo)", "Alto (Producción Original)"
    Platforms: "Instagram", "TikTok", "X (Twitter)", "Facebook", "LinkedIn", "Web"
    Formats: "Reels", "Historias", "Carruseles", "Hilos", "Video Largo", "Imagen Estática"
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Analiza el siguiente 'Magic Prompt' del usuario y selecciona las mejores opciones de configuración para una campaña cultural sobre ${figure.name}.
            
            Magic Prompt: "${magicPrompt}"
            
            Debes mapear la intención del usuario EXACTAMENTE a una de las opciones válidas listadas abajo. Si no se especifica, infiere la mejor opción basada en la plataforma o el objetivo.
            
            OPCIONES VÁLIDAS:
            ${validOptions}
            
            También genera un 'strategicGoal' refinado basado en el prompt.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.2 // Low temperature for strict classification
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Auto-Config Error", error);
        return {};
    }
}

/**
 * Generates Cronoposting Schedule
 */
export const generateCronoposting = async (figure: HistoricalFigure, config: CronoConfig) => {
    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            overview: { type: Type.STRING, description: "Strategic summary of the schedule" },
            posts: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.INTEGER },
                        date: { type: Type.STRING },
                        platform: { type: Type.STRING },
                        format: { type: Type.STRING },
                        concept: { type: Type.STRING },
                        copyBrief: { type: Type.STRING },
                        visualPrompt: { type: Type.STRING },
                        objective: { type: Type.STRING }
                    }
                }
            }
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Genera un Calendario de Difusión Cultural (Cronoposting) para ${figure.name}.
            
            CONFIGURACIÓN TÁCTICA:
            - Objetivo Magic Prompt: ${config.magicPrompt}
            - Objetivo Estratégico: ${config.strategicGoal}
            - Duración: ${config.duration}
            - Fecha Inicio: ${config.startDate}
            - Frecuencia: ${config.frequency}
            - Tono: ${config.tone}
            - Mix de Contenido: ${config.contentMix}
            - KPI Principal: ${config.kpi}
            - Nivel de Producción: ${config.productionLevel}
            - Plataformas Activas: ${config.platforms.join(', ')}
            - Formatos Clave: ${config.formats.join(', ')}

            Genera una lista de publicaciones (máximo 10-15 ejemplos representativos si la duración es larga) que cumplan estrictamente con esta configuración cultural y sociológica.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.7
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Crono Gen Error", error);
        return { overview: "Error generating schedule.", posts: [] };
    }
}