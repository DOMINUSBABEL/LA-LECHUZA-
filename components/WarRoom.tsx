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
      content: `COMMAND RECEIVED: ${intent}`,
      metadata: { type: 'USER_INPUT' }
    });
    setLogs(newLogs);

    try {
      // Parallel Execution for visual effect (Simulating a team working)
      // 1. G2 Context Phase
      const g2Promise = runAgentOperation(AgentRole.G2, selectedFigure, intent);
      
      setLogs(prev => [...prev, { id: 'thinking-g2', agent: AgentRole.G2, timestamp: new Date(), content: 'Analyzing cultural vectors...', isThinking: true }]);
      
      const g2Res = await g2Promise;
      
      setLogs(prev => prev.filter(l => l.id !== 'thinking-g2').concat({
        id: Date.now().toString() + 'g2',
        agent: AgentRole.G2,
        timestamp: new Date(),
        content: g2Res
      }));

      // 2. G3 Strategy (Dependent on G2)
      setLogs(prev => [...prev, { id: 'thinking-g3', agent: AgentRole.G3, timestamp: new Date(), content: 'Formulating dissemination strategy...', isThinking: true }]);
      const g3Res = await runAgentOperation(AgentRole.G3, selectedFigure, intent, [g2Res]);
      
      setLogs(prev => prev.filter(l => l.id !== 'thinking-g3').concat({
        id: Date.now().toString() + 'g3',
        agent: AgentRole.G3,
        timestamp: new Date(),
        content: g3Res
      }));

      // 3. G4 Narrative (Dependent)
       setLogs(prev => [...prev, { id: 'thinking-g4', agent: AgentRole.G4, timestamp: new Date(), content: 'Designing narrative artifacts...', isThinking: true }]);
      const g4Res = await runAgentOperation(AgentRole.G4, selectedFigure, intent, [g2Res, g3Res]);
      
      setLogs(prev => prev.filter(l => l.id !== 'thinking-g4').concat({
        id: Date.now().toString() + 'g4',
        agent: AgentRole.G4,
        timestamp: new Date(),
        content: g4Res
      }));

    } catch (e) {
      console.error(e);
      setLogs(prev => [...prev, { id: 'err', agent: AgentRole.G5, timestamp: new Date(), content: 'CRITICAL FAILURE IN NARRATIVE ENGINE.' }]);
    } finally {
      setIsProcessing(false);
      setIntent(''); // Clear input like a terminal
    }
  };

  const renderMarkdown = (content: string) => {
      try {
          // @ts-ignore
          const html = marked.parse(content);
          return { __html: html };
      } catch (e) {
          return { __html: `<p>${content}</p>` };
      }
  };

  return (
    <div className="flex flex-col h-full relative font-mono overflow-hidden bg-bleu-noir">
        
        {/* Background Art - Abstract Cubist Style */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none filter saturate-50 contrast-125"
             style={{
                 backgroundImage: `url('https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2576&auto=format&fit=crop')`, // Placeholder for abstract art
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 mixBlendMode: 'luminosity'
             }}>
             <div className="absolute inset-0 bg-bleu-noir/60 mix-blend-multiply"></div>
        </div>

        {/* Target Header */}
        <div className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-white/10 bg-bleu-noir/80 backdrop-blur-md">
            <div>
                <h2 className="text-lg font-bold text-bleu-clair tracking-widest flex items-center gap-2">
                    WAR ROOM // <span className="text-white">LA LECHUZA</span>
                </h2>
                <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="text-gris-moyen">ACTIVE TARGET:</span>
                    <span className="text-gris-tres-clair font-bold bg-bleu-marine px-2 py-0.5 rounded text-[10px] tracking-widest uppercase">
                        {selectedFigure ? selectedFigure.name : 'NO TARGET DESIGNATED'}
                    </span>
                </div>
            </div>
            <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-bleu-clair shadow-[0_0_10px_#398ACC]"></div>
                <div className="w-3 h-3 rounded-full bg-gris-bleu/30"></div>
                <div className="w-3 h-3 rounded-full bg-gris-bleu/30"></div>
                <div className="w-3 h-3 rounded-full bg-gris-bleu/30"></div>
            </div>
        </div>

        {/* Main Workspace (Logs as Cards) */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10 p-6 scrollbar-hide">
            
            {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gris-moyen/50 select-none pointer-events-none">
                    <svg className="w-24 h-24 mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <p className="tracking-[0.3em] text-xs">AWAITING STRATEGIC INPUT</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {logs.map((log) => {
                    const isUser = log.metadata?.type === 'USER_INPUT';
                    const config = AGENT_CONFIGS[log.agent];
                    
                    if (isUser) {
                        return (
                            <div key={log.id} className="md:col-span-2 flex justify-end">
                                <div className="bg-bleu-marine/90 backdrop-blur border-l-4 border-bleu-clair p-4 max-w-2xl rounded-r shadow-xl">
                                    <p className="text-xs text-bleu-clair font-bold mb-1 tracking-wider">> COMMAND LOG</p>
                                    <p className="text-gris-tres-clair font-sans font-medium">{log.content.replace('COMMAND RECEIVED: ', '')}</p>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={log.id} className={`relative group animate-in fade-in zoom-in-95 duration-500 ${log.agent === AgentRole.G3 ? 'md:col-span-2' : 'md:col-span-1'}`}>
                            {/* Card Decoration */}
                            <div className={`absolute -top-3 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg z-20 rounded
                                ${log.agent === AgentRole.G2 ? 'bg-indigo-600' : ''}
                                ${log.agent === AgentRole.G3 ? 'bg-bleu-clair' : ''}
                                ${log.agent === AgentRole.G4 ? 'bg-gris-bleu' : ''}
                                ${log.agent === AgentRole.G5 ? 'bg-red-500' : ''}
                            `}>
                                {config.name}
                            </div>

                            {/* Card Content */}
                            <div className="bg-[#EAE8E3] text-bleu-noir p-6 pt-8 shadow-2xl rounded-sm transform transition-all hover:-translate-y-1 relative overflow-hidden h-full border-t-4 border-bleu-noir/10">
                                {/* Paper texture effect */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
                                
                                {log.isThinking ? (
                                     <div className="flex items-center gap-3 text-gris-moyen py-4">
                                         <div className="w-4 h-4 border-2 border-bleu-marine border-t-transparent rounded-full animate-spin"></div>
                                         <span className="text-xs tracking-widest uppercase">{log.content}</span>
                                     </div>
                                ) : (
                                    <div 
                                        className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-bleu-marine prose-p:text-bleu-noir/80 prose-strong:text-bleu-marine"
                                        dangerouslySetInnerHTML={renderMarkdown(log.content)}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>

        {/* Command Input Area */}
        <div className="p-0 z-20">
             {/* Gradient Separator */}
            <div className="h-1 bg-gradient-to-r from-bleu-clair via-bleu-marine to-bleu-noir"></div>
            
            <div className="bg-bleu-noir p-4 flex gap-0">
                <div className="bg-bleu-marine text-bleu-clair px-4 py-4 font-bold text-sm tracking-widest flex items-center select-none">
                    >_
                </div>
                <input 
                    type="text" 
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    placeholder="ENTER STRATEGIC PARAMETERS..."
                    disabled={!selectedFigure || isProcessing}
                    className="flex-1 bg-bleu-marine/50 text-white font-mono p-4 focus:outline-none focus:bg-bleu-marine transition-colors placeholder:text-gris-moyen/50"
                    onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
                    autoFocus
                />
                <button 
                    onClick={executeCommand}
                    disabled={!selectedFigure || isProcessing}
                    className="bg-gris-bleu hover:bg-bleu-clair text-bleu-noir font-bold px-8 py-4 transition-all hover:tracking-widest disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm shadow-[0_0_15px_rgba(57,138,204,0.3)] z-10"
                >
                    {isProcessing ? 'EXECUTING...' : 'EXECUTE'}
                </button>
            </div>
        </div>

    </div>
  );
};

export default WarRoom;