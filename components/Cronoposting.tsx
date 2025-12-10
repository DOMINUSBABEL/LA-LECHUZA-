import React, { useState } from 'react';
import { HistoricalFigure, CronoConfig, CronoSchedule } from '../types';
import { generateCronoposting, autoConfigureCronoposting } from '../services/geminiService';

interface CronopostingProps {
  selectedFigure: HistoricalFigure | null;
}

const Cronoposting: React.FC<CronopostingProps> = ({ selectedFigure }) => {
  const [loading, setLoading] = useState(false);
  const [isAutoConfiguring, setIsAutoConfiguring] = useState(false);
  const [schedule, setSchedule] = useState<CronoSchedule | null>(null);

  // Form State
  const [magicPrompt, setMagicPrompt] = useState('');
  const [config, setConfig] = useState<Partial<CronoConfig>>({
      duration: '1 Mes (Sostenimiento)',
      startDate: new Date().toISOString().split('T')[0],
      frequency: 'Media (Constancia)',
      tone: 'Didáctico / Accesible',
      contentMix: 'Regla 70/20/10 (Valor/Debate/Promo)',
      kpi: 'Adhesión Cultural (Engagement)',
      productionLevel: 'Medio (Híbrido IA/Archivo)',
      platforms: ['Instagram', 'X (Twitter)'],
      formats: ['Stories', 'Carruseles', 'Hilos'],
      strategicGoal: ''
  });

  const handleConfigChange = (key: keyof CronoConfig, value: any) => {
      setConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'platforms' | 'formats', item: string) => {
      const current = config[key] as string[];
      const exists = current.includes(item);
      const newValue = exists ? current.filter(i => i !== item) : [...current, item];
      setConfig(prev => ({ ...prev, [key]: newValue }));
  };

  const handleAutoConfig = async () => {
    if (!selectedFigure || !magicPrompt.trim()) return;
    setIsAutoConfiguring(true);
    
    // Call AI to interpret prompt and return config
    const aiConfig = await autoConfigureCronoposting(selectedFigure, magicPrompt);
    
    // Update state with AI suggestions, keeping existing values if AI returns null/undefined for a field
    setConfig(prev => ({
        ...prev,
        ...aiConfig,
        // Ensure arrays are handled correctly if AI returns single string or null
        platforms: Array.isArray(aiConfig.platforms) && aiConfig.platforms.length > 0 ? aiConfig.platforms : prev.platforms,
        formats: Array.isArray(aiConfig.formats) && aiConfig.formats.length > 0 ? aiConfig.formats : prev.formats,
    }));

    setIsAutoConfiguring(false);
  };

  const handleGenerate = async () => {
      if (!selectedFigure) return;
      setLoading(true);
      const fullConfig: CronoConfig = {
          ...config as CronoConfig,
          magicPrompt,
          strategicGoal: config.strategicGoal || magicPrompt
      };
      const result = await generateCronoposting(selectedFigure, fullConfig);
      setSchedule(result as CronoSchedule);
      setLoading(false);
  };

  if (!selectedFigure) return <div className="p-10 text-center text-gris-moyen">Seleccione un sujeto para configurar el Cronoposting.</div>;

  return (
    <div className="h-full overflow-y-auto p-6 text-gris-clair font-sans">
      
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-gris-moyen/30">
         <h2 className="text-xl font-bold text-gris-tres-clair flex items-center gap-2">
            <span className="text-2xl">🗓️</span> GENERADOR DE CRONOPOSTING (CULTURAL)
         </h2>
         <p className="text-gris-moyen text-sm mt-1">Configuración Avanzada de Matriz de Contenidos - Alta Frecuencia</p>
      </div>

      {/* Magic Prompt Section */}
      <div className="bg-bleu-marine/20 rounded-lg p-6 border border-gris-moyen/30 mb-6 shadow-sm">
         <h3 className="text-xs font-bold text-bleu-clair uppercase mb-3 flex items-center gap-2">
            ✨ AUTOCONFIGURACIÓN TÁCTICA (MAGIC PROMPT)
         </h3>
         <div className="relative">
            <textarea 
                className="w-full bg-bleu-noir border border-gris-moyen rounded p-4 text-gris-tres-clair focus:border-bleu-clair focus:outline-none transition-colors pr-16"
                rows={3}
                placeholder={`Ej: Campaña de un mes para ${selectedFigure.name} enfocada en sus cartas desde el exilio, tono emotivo pero riguroso...`}
                value={magicPrompt}
                onChange={(e) => setMagicPrompt(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                        handleAutoConfig();
                    }
                }}
            />
            
            {/* Magic Button */}
            <button 
                onClick={handleAutoConfig}
                disabled={isAutoConfiguring || !magicPrompt.trim()}
                className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg 
                    ${isAutoConfiguring 
                        ? 'bg-gris-moyen cursor-wait' 
                        : 'bg-gradient-to-r from-bleu-moyen to-bleu-clair hover:scale-105 active:scale-95'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Ejecutar Autoconfiguración"
            >
                {isAutoConfiguring ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.97 15.03a.75.75 0 011.06 0l1.97 1.97a.75.75 0 11-1.06 1.06l-1.97-1.97a.75.75 0 010-1.06zm9.19-9.19a.75.75 0 011.06 0l1.97 1.97a.75.75 0 11-1.06 1.06l-1.97-1.97a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
         </div>
         <p className="text-xs text-gris-moyen mt-2 italic">Describe tu objetivo y haz clic en el botón mágico para ajustar los parámetros automáticamente.</p>
      </div>

      {/* Parameters Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 transition-opacity duration-500 ${isAutoConfiguring ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
         
         {/* Column 1: Temporal */}
         <div className="space-y-4">
            <h4 className="text-xs font-bold text-gris-bleu uppercase border-b border-gris-moyen/30 pb-2">Parámetros Temporales</h4>
            
            <div>
                <label className="block text-xs font-bold text-gris-clair mb-1">DURACIÓN</label>
                <select className="w-full bg-bleu-noir border border-gris-moyen rounded p-2 text-sm text-gris-tres-clair focus:border-bleu-clair outline-none"
                    value={config.duration} onChange={(e) => handleConfigChange('duration', e.target.value)}>
                    <option>1 Semana (Blitz)</option>
                    <option>1 Mes (Sostenimiento)</option>
                    <option>3 Meses (Campaña Trimestral)</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-gris-clair mb-1">FECHA DE INICIO</label>
                <input type="date" className="w-full bg-bleu-noir border border-gris-moyen rounded p-2 text-sm text-gris-tres-clair focus:border-bleu-clair outline-none"
                    value={config.startDate} onChange={(e) => handleConfigChange('startDate', e.target.value)} />
            </div>

            <div>
                <label className="block text-xs font-bold text-gris-clair mb-1">FRECUENCIA</label>
                <select className="w-full bg-bleu-noir border border-gris-moyen rounded p-2 text-sm text-gris-tres-clair focus:border-bleu-clair outline-none"
                    value={config.frequency} onChange={(e) => handleConfigChange('frequency', e.target.value)}>
                    <option>Baja (Calidad/Ensayo)</option>
                    <option>Media (Constancia)</option>
                    <option>Alta (Dominancia Algoritmo)</option>
                </select>
            </div>
         </div>

         {/* Column 2: Strategy */}
         <div className="space-y-4">
            <h4 className="text-xs font-bold text-gris-bleu uppercase border-b border-gris-moyen/30 pb-2">Estrategia de Contenido</h4>
            
            <div>
                <label className="block text-xs font-bold text-gris-clair mb-1">TONO DE COMUNICACIÓN</label>
                <select className="w-full bg-bleu-noir border border-gris-moyen rounded p-2 text-sm text-gris-tres-clair focus:border-bleu-clair outline-none"
                    value={config.tone} onChange={(e) => handleConfigChange('tone', e.target.value)}>
                    <option>Didáctico / Accesible</option>
                    <option>Solemne / Académico</option>
                    <option>Provocador / Crítico</option>
                    <option>Emotivo / Memoria</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-gris-clair mb-1">MIX DE CONTENIDO (REGLA)</label>
                <select className="w-full bg-bleu-noir border border-gris-moyen rounded p-2 text-sm text-gris-tres-clair focus:border-bleu-clair outline-none"
                    value={config.contentMix} onChange={(e) => handleConfigChange('contentMix', e.target.value)}>
                    <option>Regla 70/20/10 (Valor/Debate/Promo)</option>
                    <option>Storytelling Puro (Narrativa)</option>
                    <option>Archivo Documental (Evidencia)</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-gris-clair mb-1">KPI PRINCIPAL</label>
                <select className="w-full bg-bleu-noir border border-gris-moyen rounded p-2 text-sm text-gris-tres-clair focus:border-bleu-clair outline-none"
                    value={config.kpi} onChange={(e) => handleConfigChange('kpi', e.target.value)}>
                    <option>Adhesión Cultural (Engagement)</option>
                    <option>Alcance (Viralidad)</option>
                    <option>Profundidad (Lectura/Retención)</option>
                </select>
            </div>
         </div>

         {/* Column 3: Resources */}
         <div className="space-y-4">
            <h4 className="text-xs font-bold text-gris-bleu uppercase border-b border-gris-moyen/30 pb-2">Canales y Recursos</h4>
            
            <div>
                <label className="block text-xs font-bold text-gris-clair mb-1">NIVEL DE PRODUCCIÓN</label>
                <select className="w-full bg-bleu-noir border border-gris-moyen rounded p-2 text-sm text-gris-tres-clair focus:border-bleu-clair outline-none"
                    value={config.productionLevel} onChange={(e) => handleConfigChange('productionLevel', e.target.value)}>
                    <option>Bajo (Solo Texto/IA)</option>
                    <option>Medio (Híbrido IA/Archivo)</option>
                    <option>Alto (Producción Original)</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-gris-clair mb-2">PLATAFORMAS ACTIVAS</label>
                <div className="flex flex-wrap gap-2">
                    {['Instagram', 'TikTok', 'X (Twitter)', 'Facebook', 'LinkedIn', 'Web'].map(p => (
                        <button key={p} 
                            onClick={() => toggleArrayItem('platforms', p)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${config.platforms?.includes(p) ? 'bg-bleu-clair border-bleu-clair text-bleu-noir' : 'bg-bleu-noir border-gris-moyen text-gris-moyen'}`}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gris-clair mb-2">FORMATOS CLAVE</label>
                <div className="flex flex-wrap gap-2">
                    {['Reels', 'Historias', 'Carruseles', 'Hilos', 'Video Largo', 'Imagen Estática'].map(f => (
                        <button key={f} 
                            onClick={() => toggleArrayItem('formats', f)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${config.formats?.includes(f) ? 'bg-bleu-moyen border-bleu-moyen text-white' : 'bg-bleu-noir border-gris-moyen text-gris-moyen'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>
         </div>
      </div>

      <div className={`mb-8 transition-opacity duration-500 ${isAutoConfiguring ? 'opacity-50' : 'opacity-100'}`}>
        <label className="block text-xs font-bold text-gris-clair mb-1">OBJETIVO ESTRATÉGICO (GENERADO)</label>
        <input 
            type="text" 
            className="w-full bg-bleu-noir border border-gris-moyen rounded p-2 text-sm text-gris-tres-clair focus:border-bleu-clair outline-none"
            placeholder="Aumentar lecturas del archivo histórico a 5000..."
            value={config.strategicGoal} 
            onChange={(e) => handleConfigChange('strategicGoal', e.target.value)} 
        />
      </div>

      <div className="flex justify-end mb-8">
        <button 
            onClick={handleGenerate}
            disabled={loading || isAutoConfiguring}
            className="px-8 py-3 bg-bleu-clair text-bleu-noir font-bold rounded hover:bg-bleu-moyen disabled:opacity-50 shadow-lg transition-transform active:scale-95"
        >
            {loading ? 'GENERANDO CALENDARIO...' : 'GENERAR CRONOPOSTING'}
        </button>
      </div>

      {/* Results View */}
      {schedule && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-xl font-bold text-gris-tres-clair mb-4 border-l-4 border-bleu-clair pl-3">PLANIFICACIÓN GENERADA</h3>
            
            <div className="bg-bleu-marine/20 p-4 rounded mb-6 text-sm text-gris-clair border border-gris-moyen/30">
                <strong className="text-bleu-clair block mb-1">RESUMEN ESTRATÉGICO:</strong>
                {schedule.overview}
            </div>

            <div className="grid gap-4">
                {schedule.posts.map((post, idx) => (
                    <div key={idx} className="bg-bleu-noir border border-gris-moyen/30 rounded-lg p-4 hover:border-bleu-clair transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <span className="bg-gris-moyen/20 text-gris-tres-clair font-mono px-2 py-1 rounded text-xs font-bold">DÍA {post.day}</span>
                                <span className="text-gris-moyen text-xs">{post.date}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="bg-bleu-marine text-bleu-clair px-2 py-1 rounded text-[10px] uppercase font-bold border border-bleu-clair/30">{post.platform}</span>
                                <span className="bg-bleu-marine text-gris-bleu px-2 py-1 rounded text-[10px] uppercase font-bold border border-gris-bleu/30">{post.format}</span>
                            </div>
                        </div>
                        <h4 className="text-gris-tres-clair font-bold mb-2">{post.concept}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-bleu-marine/30 p-3 rounded">
                                <p className="text-[10px] text-gris-moyen uppercase font-bold mb-1">Brief de Copy</p>
                                <p className="text-gris-clair">{post.copyBrief}</p>
                            </div>
                            <div className="bg-bleu-marine/30 p-3 rounded">
                                <p className="text-[10px] text-gris-moyen uppercase font-bold mb-1">Visual Prompt</p>
                                <p className="text-gris-clair italic">{post.visualPrompt}</p>
                            </div>
                        </div>
                        <div className="mt-2 text-right">
                             <span className="text-[10px] text-bleu-moyen font-mono">OBJETIVO: {post.objective}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

    </div>
  );
};

export default Cronoposting;