import React, { useState } from 'react';
import { HistoricalFigure, AudienceArchetype, NarrativeVoice, StrategicMatrix, NarrativeArtifact } from '../types';
import { generateStrategyMatrix, generateViralPayloads } from '../services/geminiService';

interface StrategyMatrixProps {
  selectedFigure: HistoricalFigure | null;
}

const StrategyMatrix: React.FC<StrategyMatrixProps> = ({ selectedFigure }) => {
  const [matrixData, setMatrixData] = useState<StrategicMatrix | null>(null);
  const [loading, setLoading] = useState(false);
  const [intent, setIntent] = useState("Aumentar visibilidad y relevancia histórica");
  const [selectedCell, setSelectedCell] = useState<{avatar: AudienceArchetype, angle: NarrativeVoice} | null>(null);
  const [payloads, setPayloads] = useState<NarrativeArtifact[]>([]);
  const [payloadLoading, setPayloadLoading] = useState(false);

  const generateMatrix = async () => {
    if (!selectedFigure) return;
    setLoading(true);
    const result = await generateStrategyMatrix(selectedFigure, intent);
    setMatrixData(result as unknown as StrategicMatrix); // Type assertion for simplicity
    setLoading(false);
  };

  const handleCellClick = async (avatar: AudienceArchetype, angle: NarrativeVoice) => {
      setSelectedCell({ avatar, angle });
      setPayloadLoading(true);
      const res = await generateViralPayloads(selectedFigure!, angle.name, avatar.name);
      setPayloads(res.payloads || []);
      setPayloadLoading(false);
  };

  if (!selectedFigure) return <div className="p-10 text-center text-slate-500">Seleccione un sujeto para iniciar la Matriz de Resonancia.</div>;

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-900 text-slate-200">
        <div className="mb-8 flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-lechuza-gold mb-2">MATRIZ DE RESONANCIA SOCIOLÓGICA</h2>
                <p className="text-sm text-slate-400">Cruce de Arquetipos Culturales vs. Voces Narrativas para identificar oportunidades de difusión.</p>
            </div>
            <div className="flex gap-2">
                 <input 
                    className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm w-64"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                />
                <button 
                    onClick={generateMatrix}
                    disabled={loading}
                    className="px-4 py-2 bg-lechuza-gold text-slate-900 font-bold rounded text-sm hover:bg-amber-500 disabled:opacity-50"
                >
                    {loading ? 'CALCULANDO...' : 'GENERAR MATRIZ'}
                </button>
            </div>
        </div>

        {matrixData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Matrix Representation */}
                <div className="bg-slate-800 p-4 rounded border border-slate-700 overflow-x-auto">
                    <h3 className="text-lechuza-accent font-mono mb-4 text-sm">MATRIZ DE INTERSECCIÓN (5x5)</h3>
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-2 border border-slate-700 bg-slate-900">VOZ \ ARQUETIPO</th>
                                {matrixData.avatars.slice(0,5).map((av, i) => (
                                    <th key={i} className="p-2 border border-slate-700 bg-slate-900 font-normal text-slate-400 w-32">
                                        <div className="font-bold text-white">{av.name}</div>
                                        <div className="text-[10px] truncate opacity-70">{av.culturalInterest}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrixData.angles.slice(0,5).map((ang, i) => (
                                <tr key={i}>
                                    <td className="p-2 border border-slate-700 bg-slate-900 font-bold text-lechuza-gold">
                                        {ang.name}
                                        <div className="text-[10px] text-slate-500 font-normal">{ang.tone}</div>
                                    </td>
                                    {matrixData.avatars.slice(0,5).map((av, j) => (
                                        <td key={j} className="p-2 border border-slate-700 hover:bg-slate-700 cursor-pointer transition-colors"
                                            onClick={() => handleCellClick(av, ang)}>
                                            <div className="flex justify-center items-center h-full">
                                                <div className="w-3 h-3 rounded-full bg-green-500 opacity-20 hover:opacity-100"></div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Details Panel */}
                <div className="space-y-6">
                    {selectedCell ? (
                        <div className="glass-panel p-6 rounded border border-lechuza-accent/30 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-xl font-bold text-white mb-4">DETALLE TÁCTICO</h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-slate-900/50 rounded">
                                    <h4 className="text-xs text-slate-400 uppercase">Arquetipo Objetivo</h4>
                                    <p className="font-bold text-lechuza-accent">{selectedCell.avatar.name}</p>
                                    <p className="text-xs mt-1 text-slate-300">{selectedCell.avatar.sociologicalProfile}</p>
                                    <p className="text-[10px] mt-2 text-slate-500">Interés: {selectedCell.avatar.culturalInterest}</p>
                                </div>
                                <div className="p-3 bg-slate-900/50 rounded">
                                    <h4 className="text-xs text-slate-400 uppercase">Voz Narrativa</h4>
                                    <p className="font-bold text-lechuza-gold">{selectedCell.angle.name}</p>
                                    <p className="text-xs mt-1 text-slate-300">{selectedCell.angle.pedagogicalApproach}</p>
                                    <p className="text-[10px] mt-2 text-slate-500">Valor: {selectedCell.angle.coreValue}</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-700 pt-4">
                                <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                                    ARTEFACTOS NARRATIVOS 
                                    {payloadLoading && <span className="text-xs text-lechuza-accent animate-pulse">GENERANDO...</span>}
                                </h4>
                                
                                <div className="space-y-4">
                                    {payloads.map((payload, idx) => (
                                        <div key={idx} className="bg-slate-800 p-4 rounded border-l-4 border-purple-500">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs font-mono bg-purple-900 text-purple-200 px-2 py-1 rounded">{payload.format}</span>
                                                <span className="text-xs text-slate-400">VALOR: {payload.educationalValue}</span>
                                            </div>
                                            <p className="font-bold text-white mb-2">"{payload.hook}"</p>
                                            <p className="text-sm text-slate-300 mb-2 italic">{payload.context}</p>
                                            <div className="text-xs text-slate-500 bg-slate-900 p-2 rounded">
                                                CONCEPTO VISUAL: {payload.visualConcept}
                                            </div>
                                        </div>
                                    ))}
                                    {!payloadLoading && payloads.length === 0 && (
                                        <p className="text-sm text-slate-500">Selecciona una intersección para generar ideas de contenido.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-600 border border-dashed border-slate-700 rounded">
                            Selecciona una intersección en la matriz para ver el desglose.
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default StrategyMatrix;