import React, { useState } from 'react';
import WarRoom from './components/WarRoom';
import StrategyMatrix from './components/StrategyMatrix';
import Cronoposting from './components/Cronoposting';
import { HISTORICAL_FIGURES } from './constants';
import { HistoricalFigure } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'WARROOM' | 'MATRIX' | 'CRONO'>('WARROOM');
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null);

  const selectedFigure = HISTORICAL_FIGURES.find(f => f.id === selectedFigureId) || null;

  return (
    <div className="flex h-screen bg-lechuza-dark overflow-hidden font-sans text-slate-100">
      
      {/* Sidebar / Dossier Selector */}
      <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold font-mono tracking-tighter">
            <span className="text-lechuza-accent">LA</span> LECHUZA
          </h1>
          <p className="text-xs text-slate-500 mt-1">Observatorio Cultural</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 px-2">Archivo Histórico</h3>
            <div className="space-y-1">
              {HISTORICAL_FIGURES.map(figure => (
                <button
                  key={figure.id}
                  onClick={() => setSelectedFigureId(figure.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
                    selectedFigureId === figure.id 
                      ? 'bg-lechuza-accent/10 text-lechuza-accent border-l-2 border-lechuza-accent' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="font-medium truncate">{figure.name}</div>
                  <div className="text-[10px] opacity-60 truncate">{figure.tags[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-950">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs text-green-500 font-mono">SYSTEM ONLINE</span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Navigation Bar */}
        <nav className="h-14 bg-slate-900/80 border-b border-slate-700 flex items-center px-6 gap-6 backdrop-blur-sm z-20 overflow-x-auto scrollbar-hide">
            <button 
                onClick={() => setActiveTab('WARROOM')}
                className={`h-full border-b-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'WARROOM' 
                    ? 'border-lechuza-accent text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
                OBSERVATORIO
            </button>
            <button 
                onClick={() => setActiveTab('MATRIX')}
                className={`h-full border-b-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'MATRIX' 
                    ? 'border-lechuza-gold text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
                MATRIZ SOCIOLÓGICA
            </button>
            <button 
                onClick={() => setActiveTab('CRONO')}
                className={`h-full border-b-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'CRONO' 
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
                CRONOPOSTING
            </button>
        </nav>

        {/* Dynamic View */}
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