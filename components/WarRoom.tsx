import React, { useState, useEffect, useRef } from 'react';
import { AgentRole, HistoricalFigure, AgentLog } from '../types';
import { runAgentOperation } from '../services/geminiService';
import { AGENT_CONFIGS } from '../constants';
import { marked } from 'marked';

interface WarRoomProps {
  selectedFigure: HistoricalFigure | null;
  onPayloadGenerated: (data: any) => void;
}

const WarRoom: React.FC<WarRoomProps> = ({ selectedFigure, onPayloadGenerated }) => {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [intent, setIntent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const executeCommand = async () => {
    if (!selectedFigure || !intent.trim()) return;
    
    setIsProcessing(true);
    const newLogs = [...logs];

    // Add User Command
    const cmdId = Date.now().toString();
    newLogs.push({
      id: cmdId,
      agent: AgentRole.G3, 
      timestamp: new Date(),
      content: `CONSULTA INICIADA: ${intent} | SUJETO: ${selectedFigure.name}`,
      metadata: { type: 'USER_INPUT' }
    });
    setLogs(newLogs);

    try {
      // 1. G2 Context Phase
      setLogs(prev => [...prev, { id: 'thinking-g2', agent: AgentRole.G2, timestamp: new Date(), content: 'Analizando contexto histórico y redes de influencia...', isThinking: true }]);
      const g2Res = await runAgentOperation(AgentRole.G2, selectedFigure, intent);
      setLogs(prev => prev.filter(l => l.id !== 'thinking-g2').concat({
        id: Date.now().toString() + 'g2',
        agent: AgentRole.G2,
        timestamp: new Date(),
        content: g2Res
      }));

      // 2. G3 Diffusion Phase
      setLogs(prev => [...prev, { id: 'thinking-g3', agent: AgentRole.G3, timestamp: new Date(), content: 'Diseñando estrategias de mediación cultural...', isThinking: true }]);
      const g3Res = await runAgentOperation(AgentRole.G3, selectedFigure, intent, [g2Res]);
      setLogs(prev => prev.filter(l => l.id !== 'thinking-g3').concat({
        id: Date.now().toString() + 'g3',
        agent: AgentRole.G3,
        timestamp: new Date(),
        content: g3Res
      }));

      // 3. G5 Critical Review (Parallel)
      setLogs(prev => [...prev, { id: 'thinking-g5', agent: AgentRole.G5, timestamp: new Date(), content: 'Evaluando integridad histórica y ética...', isThinking: true }]);
      const g5Res = await runAgentOperation(AgentRole.G5, selectedFigure, intent, [g2Res]);
      setLogs(prev => prev.filter(l => l.id !== 'thinking-g5').concat({
        id: Date.now().toString() + 'g5',
        agent: AgentRole.G5,
        timestamp: new Date(),
        content: g5Res
      }));

      // 4. G4 Narrative Construction
      setLogs(prev => [...prev, { id: 'thinking-g4', agent: AgentRole.G4, timestamp: new Date(), content: 'Construyendo artefactos narrativos...', isThinking: true }]);
      const g4Res = await runAgentOperation(AgentRole.G4, selectedFigure, intent, [g2Res, g3Res]);
      setLogs(prev => prev.filter(l => l.id !== 'thinking-g4').concat({
        id: Date.now().toString() + 'g4',
        agent: AgentRole.G4,
        timestamp: new Date(),
        content: g4Res
      }));

    } catch (e) {
      console.error(e);
      setLogs(prev => [...prev, { id: 'err', agent: AgentRole.G5, timestamp: new Date(), content: 'ERROR CRÍTICO EN EL SISTEMA DE ANÁLISIS.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderMarkdown = (content: string) => {
      // Basic markdown rendering using 'marked' if available, or just fallback
      try {
          // @ts-ignore
          const html = marked.parse(content);
          return { __html: html };
      } catch (e) {
          return { __html: `<p>${content}</p>` };
      }
  };

  return (
    <div className="flex flex-col h-full bg-lechuza-dark text-slate-300 font-mono relative overflow-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Header */}
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center z-10">
            <div>
                <h2 className="text-xl font-bold text-lechuza-accent tracking-widest">OBSERVATORIO // LA LECHUZA</h2>
                <p className="text-xs text-slate-500">SUJETO ACTIVO: <span className="text-white">{selectedFigure ? selectedFigure.name.toUpperCase() : 'SELECCIONAR SUJETO'}</span></p>
            </div>
            <div className="flex gap-2">
                {Object.values(AgentRole).map(role => (
                    <div key={role} className={`w-3 h-3 rounded-full ${isProcessing ? 'animate-pulse' : ''} ${AGENT_CONFIGS[role].color.replace('text-', 'bg-')}`}></div>
                ))}
            </div>
        </div>

        {/* Logs Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 z-10 scrollbar-hide">
            {logs.length === 0 && (
                <div className="text-center mt-20 opacity-30">
                    <h3 className="text-4xl mb-4">ESPERANDO CONSULTA</h3>
                    <p>Seleccione una figura histórica y defina el objetivo de difusión.</p>
                </div>
            )}
            {logs.map((log) => {
                const config = AGENT_CONFIGS[log.agent];
                const isUser = log.metadata?.type === 'USER_INPUT';
                return (
                    <div key={log.id} className={`flex gap-4 ${isUser ? 'justify-end' : ''}`}>
                         {!isUser && (
                             <div className={`w-10 h-10 rounded border ${config.borderColor} flex items-center justify-center bg-slate-900 text-lg shrink-0 mt-1`}>
                                 {config.icon}
                             </div>
                         )}
                         <div className={`max-w-4xl p-5 rounded-lg border shadow-lg ${isUser ? 'border-slate-600 bg-slate-800' : `${config.borderColor} bg-slate-900/90`}`}>
                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                <span className={`text-xs font-bold ${config.color} uppercase tracking-wider`}>{config.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{log.timestamp.toLocaleTimeString()}</span>
                            </div>
                            {log.isThinking ? (
                                <div className="flex space-x-1 items-center h-6">
                                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-150"></div>
                                </div>
                            ) : (
                                // Render Report Content using Markdown
                                <div 
                                    className={`prose prose-invert prose-sm max-w-none ${isUser ? 'font-sans' : 'font-sans text-slate-300'}`}
                                    dangerouslySetInnerHTML={renderMarkdown(log.content)}
                                />
                            )}
                         </div>
                    </div>
                );
            })}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-700 z-10">
            <div className="flex gap-4">
                <input 
                    type="text" 
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    placeholder={selectedFigure ? "Defina la intención cultural (ej. 'Reivindicar su papel en el exilio' o 'Conectar con jóvenes artistas')..." : "Seleccione una figura del panel lateral."}
                    disabled={!selectedFigure || isProcessing}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded p-3 text-white focus:border-lechuza-accent focus:outline-none disabled:opacity-50 font-sans"
                    onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
                />
                <button 
                    onClick={executeCommand}
                    disabled={!selectedFigure || isProcessing}
                    className="px-6 py-3 bg-lechuza-accent text-slate-900 font-bold rounded hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    ANALIZAR
                </button>
            </div>
        </div>
    </div>
  );
};

export default WarRoom;