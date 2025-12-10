import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate system processing delay
    setTimeout(() => {
      if (username === 'LECHUZA' && password === 'LECHUZA') {
        onLogin();
      } else {
        setError('ACCESS DENIED: INVALID CREDENTIALS');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-bleu-noir flex items-center justify-center relative overflow-hidden font-mono text-gris-tres-clair">
      
      {/* Background Abstract Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{
               backgroundImage: `linear-gradient(135deg, #1E3A5F 25%, transparent 25%), linear-gradient(225deg, #1E3A5F 25%, transparent 25%), linear-gradient(45deg, #1E3A5F 25%, transparent 25%), linear-gradient(315deg, #1E3A5F 25%, transparent 25%)`, 
               backgroundSize: '40px 40px'
           }}>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-bleu-noir via-transparent to-transparent pointer-events-none"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-1">
        
        {/* Decorative Top Border */}
        <div className="flex justify-between items-end mb-2 px-1">
             <span className="text-[10px] text-gris-moyen uppercase tracking-widest">Secure Gateway</span>
             <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                 <div className="w-1.5 h-1.5 bg-bleu-clair rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-bleu-clair rounded-full"></div>
             </div>
        </div>

        <div className="bg-bleu-marine/20 backdrop-blur-md border border-gris-moyen/30 p-8 shadow-2xl relative overflow-hidden group">
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-bleu-clair"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-bleu-clair"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-bleu-clair"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-bleu-clair"></div>

            <div className="text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                    <span className="text-bleu-clair">LA</span> LECHUZA
                </h1>
                <p className="text-xs text-gris-moyen uppercase tracking-[0.3em]">Strategic Narrative System</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-bold text-bleu-clair uppercase mb-1 tracking-wider">Identity</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-bleu-noir/80 border border-gris-moyen text-white px-4 py-3 focus:border-bleu-clair focus:outline-none transition-colors placeholder:text-gris-moyen/30 text-sm tracking-widest"
                        placeholder="ENTER USERNAME"
                        autoFocus
                    />
                </div>
                
                <div>
                    <label className="block text-[10px] font-bold text-bleu-clair uppercase mb-1 tracking-wider">Access Key</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-bleu-noir/80 border border-gris-moyen text-white px-4 py-3 focus:border-bleu-clair focus:outline-none transition-colors placeholder:text-gris-moyen/30 text-sm tracking-widest"
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <div className="text-red-400 text-xs text-center border border-red-900/50 bg-red-900/20 py-2 animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 font-bold uppercase tracking-widest text-sm transition-all duration-300 relative overflow-hidden group
                        ${loading ? 'bg-gris-moyen cursor-wait text-bleu-noir' : 'bg-bleu-clair hover:bg-white text-bleu-noir hover:scale-[1.02] shadow-[0_0_15px_rgba(57,138,204,0.4)]'}
                    `}
                >
                    {loading ? 'AUTHENTICATING...' : 'INITIALIZE SYSTEM'}
                </button>
            </form>

            <div className="mt-8 text-center">
                 <p className="text-[9px] text-gris-moyen">RESTRICTED AREA. UNAUTHORIZED ACCESS IS PROHIBITED.</p>
                 <p className="text-[9px] text-gris-moyen/50 mt-1">v.3.1.0-PREVIEW // ENCRYPTED CONNECTION</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;