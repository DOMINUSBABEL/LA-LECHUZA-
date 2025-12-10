import React, { useState } from 'react';
import WarRoom from './components/WarRoom';
import StrategyMatrix from './components/StrategyMatrix';
import Cronoposting from './components/Cronoposting';
import Login from './components/Login';
import { HISTORICAL_FIGURES } from './constants';
import { HistoricalFigure } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'WARROOM' | 'MATRIX' | 'CRONO'>('WARROOM');
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null);

  const selectedFigure = HISTORICAL_FIGURES.find(f => f.id === selectedFigureId) || null;

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-bleu-noir overflow-hidden font-sans text-gris-tres-clair selection:bg-bleu-clair selection:text-bleu-noir">
      
      {/* Sidebar - Reference Style */}
      <aside className="w-72 bg-bleu-noir/90 flex flex-col z-30 shadow-2xl relative">
        {/* Abstract pattern overlay for sidebar */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'linear-gradient(135deg, #1E3A5F 25%, transparent 25%), linear-gradient(225deg, #1E3A5F 25%, transparent 25%), linear-gradient(45deg, #1E3A5F 25%, transparent 25%), linear-gradient(315deg, #1E3A5F 25%, transparent 25%)', backgroundSize: '20px 20px'}}></div>

        <div className="p-6 relative z-10">
          <h1 className="text-3xl font-black tracking-tighter leading-none text-white">
            <span className="text-bleu-clair">LA</span> LECHUZA
          </h1>
          <p className="text-[10px] text-gris-moyen uppercase tracking-widest mt-1">Strategic Narrative System</p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 relative z-10">
            <div className="space-y-1 mt-4">
              {HISTORICAL_FIGURES.map(figure => (
                <button
                  key={figure.id}
                  onClick={() => setSelectedFigureId(figure.id)}
                  className={`group w-full text-left px-4 py-3 border-l-4 transition-all duration-300 relative overflow-hidden ${
                    selectedFigureId === figure.id 
                      ? 'border-bleu-clair bg-gradient-to-r from-bleu-marine/80 to-transparent' 
                      : 'border-transparent hover:bg-white/5 hover:border-gris-moyen'
                  }`}
                >
                  <div className={`font-bold text-sm transition-colors ${selectedFigureId === figure.id ? 'text-white' : 'text-gris-clair group-hover:text-white'}`}>
                    {figure.name}
                  </div>
                  <div className="text-[10px] text-gris-moyen uppercase tracking-wide mt-0.5">{figure.tags[0]}</div>
                </button>
              ))}
            </div>
        </div>

        <div className="p-4 bg-black/20 backdrop-blur text-[10px] font-mono text-bleu-clair flex items-center gap-2 relative z-10">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
           SYSTEM ONLINE
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-bleu-noir">
        
        {/* Top Navigation - Tab Style from Reference */}
        <header className="h-14 flex items-end px-8 gap-8 border-b border-white/10 bg-bleu-noir/95 backdrop-blur z-20">
            <button 
                onClick={() => setActiveTab('WARROOM')}
                className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'WARROOM' 
                    ? 'text-bleu-clair border-b-2 border-bleu-clair shadow-[0_4px_12px_-2px_rgba(57,138,204,0.5)]' 
                    : 'text-gris-moyen hover:text-white'
                }`}
            >
                COMMAND CENTER (WAR ROOM)
            </button>
            <button 
                onClick={() => setActiveTab('MATRIX')}
                className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'MATRIX' 
                    ? 'text-gris-bleu border-b-2 border-gris-bleu' 
                    : 'text-gris-moyen hover:text-white'
                }`}
            >
                STRATEGY MATRIX
            </button>
            <button 
                onClick={() => setActiveTab('CRONO')}
                className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'CRONO' 
                    ? 'text-bleu-moyen border-b-2 border-bleu-moyen' 
                    : 'text-gris-moyen hover:text-white'
                }`}
            >
                CRONOPOSTING
            </button>
        </header>

        {/* Dynamic View Container */}
        <div className="flex-1 relative overflow-hidden">
            {activeTab === 'WARROOM' && (
                <WarRoom 
                    selectedFigure={selectedFigure} 
                    onPayloadGenerated={() => {}} 
                />
            )}
            {activeTab === 'MATRIX' && (
                <StrategyMatrix 
                    selectedFigure={selectedFigure} 
                />
            )}
            {activeTab === 'CRONO' && (
                <Cronoposting 
                    selectedFigure={selectedFigure} 
                />
            )}
        </div>
      </main>
    </div>
  );
}

export default App;