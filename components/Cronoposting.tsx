import React, { useState } from 'react';
import { HistoricalFigure, CronoConfig, CronoSchedule } from '../types';
import { generateCronoposting } from '../services/geminiService';

interface CronopostingProps {
  selectedFigure: HistoricalFigure | null;
}

const Cronoposting: React.FC<CronopostingProps> = ({ selectedFigure }) => {
  const [loading, setLoading] = useState(false);
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

  if (!selectedFigure) return <div className="p-10 text-center text-slate-500">Seleccione un sujeto para configurar el Cronoposting.</div>;

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-900 text-slate-200 font-sans">
      
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-700">
         <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🗓️</span> GENERADOR DE CRONOPOSTING (CULTURAL)
         </h2>
         <p className="text-slate-400 text-sm mt-1">Configuración Avanzada de Matriz de Contenidos - Alta Frecuencia</p>
      </div>

      {/* Magic Prompt Section */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6 shadow-sm">
         <h3 className="text-xs font-bold text-lechuza-accent uppercase mb-3 flex items-center gap-2">
            ✨ AUTOCONFIGURACIÓN TÁCTICA (MAGIC PROMPT)
         </h3>
         <textarea 
            className="w-full bg-slate-900 border border-slate-600 rounded p-4 text-white focus:border-lechuza-accent focus:outline-none transition-colors"
            rows={3}
            placeholder={`Ej: Campaña de un mes para ${selectedFigure.name} enfocada en sus cartas desde el exilio, tono emotivo pero riguroso...`}
            value={magicPrompt}
            onChange={(e) => setMagicPrompt(e.target.value)}
         />
         <p className="text-xs text-slate-500 mt-2 italic">Describe tu objetivo y la IA ajustará el enfoque táctico automáticamente.</p>
      </div>

      {/* Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
         
         {/* Column 1: Temporal */}
         <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase border-b border-slate-700 pb-2">Parámetros Temporales</h4>
            
            <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">DURACIÓN</label>
                <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
                    value={config.duration} onChange={(e) => handleConfigChange('duration', e.target.value)}>
                    <option>1 Semana (Blitz)</option>
                    <option>1 Mes (Sostenimiento)</option>
                    <option>3 Meses (Campaña Trimestral)</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">FECHA DE INICIO</label>
                <input type="date" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
                    value={config.startDate} onChange={(e) => handleConfigChange('startDate', e.target.value)} />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">FRECUENCIA</label>
                <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
                    value={config.frequency} onChange={(e) => handleConfigChange('frequency', e.target.value)}>
                    <option>Baja (Calidad/Ensayo)</option>
                    <option>Media (Constancia)</option>
                    <option>Alta (Dominancia Algoritmo)</option>
                </select>
            </div>
         </div>

         {/* Column 2: Strategy */}
         <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase border-b border-slate-700 pb-2">Estrategia de Contenido</h4>
            
            <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">TONO DE COMUNICACIÓN</label>
                <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
                    value={config.tone} onChange={(e) => handleConfigChange('tone', e.target.value)}>
                    <option>Didáctico / Accesible</option>
                    <option>Solemne / Académico</option>
                    <option>Provocador / Crítico</option>
                    <option>Emotivo / Memoria</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">MIX DE CONTENIDO (REGLA)</label>
                <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
                    value={config.contentMix} onChange={(e) => handleConfigChange('contentMix', e.target.value)}>
                    <option>Regla 70/20/10 (Valor/Debate/Promo)</option>
                    <option>Storytelling Puro (Narrativa)</option>
                    <option>Archivo Documental (Evidencia)</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">KPI PRINCIPAL</label>
                <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
                    value={config.kpi} onChange={(e) => handleConfigChange('kpi', e.target.value)}>
                    <option>Adhesión Cultural (Engagement)</option>
                    <option>Alcance (Viralidad)</option>
                    <option>Profundidad (Lectura/Retención)</option>
                </select>
            </div>
         </div>

         {/* Column 3: Resources */}
         <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase border-b border-slate-700 pb-2">Canales y Recursos</h4>
            
            <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">NIVEL DE PRODUCCIÓN</label>
                <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
                    value={config.productionLevel} onChange={(e) => handleConfigChange('productionLevel', e.target.value)}>
                    <option>Bajo (Solo Texto/IA)</option>
                    <option>Medio (Híbrido IA/Archivo)</option>
                    <option>Alto (Producción Original)</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">PLATAFORMAS ACTIVAS</label>
                <div className="flex flex-wrap gap-2">
                    {['Instagram', 'TikTok', 'X (Twitter)', 'Facebook', 'LinkedIn', 'Web'].map(p => (
                        <button key={p} 
                            onClick={() => toggleArrayItem('platforms', p)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${config.platforms?.includes(p) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">FORMATOS CLAVE</label>
                <div className="flex flex-wrap gap-2">
                    {['Reels', 'Historias', 'Carruseles', 'Hilos', 'Video Largo', 'Imagen Estática'].map(f => (
                        <button key={f} 
                            onClick={() => toggleArrayItem('formats', f)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${config.formats?.includes(f) ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>
         </div>
      </div>

      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-300 mb-1">OBJETIVO ESTRATÉGICO (OPCIONAL)</label>
        <input 
            type="text" 
            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
            placeholder="Aumentar lecturas del archivo histórico a 5000..."
            value={config.strategicGoal} 
            onChange={(e) => handleConfigChange('strategicGoal', e.target.value)} 
        />
      </div>

      <div className="flex justify-end mb-8">
        <button 
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-3 bg-lechuza-gold text-slate-900 font-bold rounded hover:bg-amber-500 disabled:opacity-50 shadow-lg transition-transform active:scale-95"
        >
            {loading ? 'GENERANDO CALENDARIO...' : 'GENERAR CRONOPOSTING'}
        </button>
      </div>

      {/* Results View */}
      {schedule && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-lechuza-gold pl-3">PLANIFICACIÓN GENERADA</h3>
            
            <div className="bg-slate-800 p-4 rounded mb-6 text-sm text-slate-300 border border-slate-700">
                <strong className="text-lechuza-gold block mb-1">RESUMEN ESTRATÉGICO:</strong>
                {schedule.overview}
            </div>

            <div className="grid gap-4">
                {schedule.posts.map((post, idx) => (
                    <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-lechuza-accent transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <span className="bg-slate-700 text-white font-mono px-2 py-1 rounded text-xs font-bold">DÍA {post.day}</span>
                                <span className="text-slate-400 text-xs">{post.date}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="bg-blue-900/50 text-blue-200 px-2 py-1 rounded text-[10px] uppercase font-bold border border-blue-900">{post.platform}</span>
                                <span className="bg-red-900/50 text-red-200 px-2 py-1 rounded text-[10px] uppercase font-bold border border-red-900">{post.format}</span>
                            </div>
                        </div>
                        <h4 className="text-white font-bold mb-2">{post.concept}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-900/50 p-3 rounded">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Brief de Copy</p>
                                <p className="text-slate-300">{post.copyBrief}</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Visual Prompt</p>
                                <p className="text-slate-300 italic">{post.visualPrompt}</p>
                            </div>
                        </div>
                        <div className="mt-2 text-right">
                             <span className="text-[10px] text-green-500 font-mono">OBJETIVO: {post.objective}</span>
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