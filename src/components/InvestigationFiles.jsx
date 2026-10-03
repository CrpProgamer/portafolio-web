import { useState, useEffect } from 'react';

const playBeep = (freq = 800, duration = 0.05) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio Context not supported or allowed yet
  }
};

const playGlitchSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = ctx.sampleRate * 0.2; // 0.2 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch(e) {}
};

const files = [
  { id: 'pbi', name: 'EXP. COLCHAGUA_PBI', type: 'DASHBOARD' },
  { id: 'notebook_1', name: 'ETL_ANALYSIS.ipynb', type: 'JUPYTER' },
  { id: 'notebook_2', name: 'ML_FORECAST.ipynb', type: 'JUPYTER' },
  { id: 'findings', name: 'HALLAZGOS_TECNICOS.txt', type: 'TEXT' }
];

export default function InvestigationFiles() {
  const [activeFile, setActiveFile] = useState(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);

  const handleOpenFile = (fileId) => {
    playBeep(1200, 0.1);
    setIsDecrypting(true);
    setDecryptProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        playGlitchSound();
        setIsDecrypting(false);
        setActiveFile(fileId);
      }
      setDecryptProgress(progress);
      playBeep(400 + Math.random() * 400, 0.02);
    }, 150);
  };

  return (
    <div className="border border-murkoff-dark bg-murkoff-black shadow-[0_0_15px_rgba(46,204,113,0.1)] relative mt-8">
      <div className="border-b border-murkoff-dark p-2 bg-[#050505] flex gap-4 overflow-x-auto">
        {files.map(f => (
          <button 
            key={f.id}
            onClick={() => handleOpenFile(f.id)}
            className={`px-4 py-2 font-bold text-xs uppercase flex items-center gap-2 border ${
              activeFile === f.id ? 'border-murkoff-glitch text-murkoff-glitch bg-[#0a200a]' : 'border-murkoff-dark text-gray-500 hover:text-murkoff-paper hover:border-gray-500'
            } transition-colors whitespace-nowrap`}
          >
            {activeFile === f.id && <span className="animate-pulse">▶</span>}
            {f.name}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6 min-h-[500px] relative">
        {isDecrypting ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <p className="text-murkoff-glitch font-bold text-xl mb-4 animate-pulse">DESENCRIPTANDO DATOS...</p>
            <div className="w-64 h-4 border border-murkoff-dark bg-black p-0.5">
              <div 
                className="h-full bg-murkoff-glitch transition-all duration-75"
                style={{ width: `${decryptProgress}%` }}
              ></div>
            </div>
            <p className="text-murkoff-glitch mt-2 font-mono">{decryptProgress}%</p>
          </div>
        ) : null}

        {!activeFile && !isDecrypting && (
          <div className="h-full flex flex-col items-center justify-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="tracking-widest uppercase text-sm">SELECCIONE UN ARCHIVO PARA VISUALIZAR</p>
          </div>
        )}

        {/* Content based on active file */}
        {activeFile === 'pbi' && (
          <div className="h-[600px] border border-murkoff-dark relative group">
            {/* Simulated Power BI Container */}
            <div className="absolute inset-0 bg-[#111] p-2">
              <div className="w-full h-full border border-murkoff-dark relative overflow-hidden flex flex-col items-center justify-center">
                 <div className="absolute inset-0 bg-murkoff-glitch opacity-[0.02] mix-blend-overlay"></div>
                 <h3 className="text-murkoff-paper text-xl font-bold border-b border-murkoff-dark pb-2 mb-4 w-3/4 text-center">ANÁLISIS TERRITORIAL: CASO COLCHAGUA</h3>
                 
                 {/* Placeholder for real iframe */}
                 <div className="w-full max-w-4xl aspect-video bg-[#050505] border border-murkoff-dark flex flex-col items-center justify-center shadow-inner">
                    <p className="text-murkoff-blood font-bold tracking-widest uppercase">ÁREA RESTRINGIDA</p>
                    <p className="text-xs text-gray-500 mt-2 text-center max-w-md">Para el despliegue final, reemplace este bloque con el iframe real de Power BI generado desde el servicio de Microsoft.</p>
                    <code className="text-xs text-murkoff-glitch mt-4 p-2 bg-black border border-murkoff-dark overflow-x-auto w-3/4 max-w-xl text-left">
                      &lt;iframe title="Colchagua_Analysis" width="100%" height="100%" src="https://app.powerbi.com/view?r=YOUR_EMBED_URL" frameborder="0" allowFullScreen="true"&gt;&lt;/iframe&gt;
                    </code>
                 </div>
              </div>
            </div>
          </div>
        )}

        {(activeFile === 'notebook_1' || activeFile === 'notebook_2') && (
          <div className="h-full border border-murkoff-dark bg-[#0a0a0a] p-6 text-sm font-mono overflow-y-auto">
            <h3 className="text-murkoff-glitch text-lg mb-4 border-b border-murkoff-dark pb-2">
              [ {activeFile === 'notebook_1' ? 'ETL_ANALYSIS.ipynb' : 'ML_FORECAST.ipynb'} ]
            </h3>
            <p className="text-gray-400 mb-6 text-justify">
              Este bloque contiene el código fuente clasificado del análisis realizado. El sujeto C.A. Rojas aplicó técnicas de limpieza de datos, extracción (ETL) y modelado predictivo para el Valle de Colchagua.
            </p>
            
            <div className="bg-black p-4 border-l-2 border-murkoff-glitch mb-4">
              <p className="text-gray-500 text-xs mb-1">In [1]:</p>
              <code className="text-murkoff-paper">
                import pandas as pd<br/>
                import numpy as np<br/>
                import murkoff_secure_db as db<br/>
                <br/>
                data = db.connect_and_extract('colchagua_raw')<br/>
                print(f"Filas recuperadas: &#123;len(data)&#125;")
              </code>
            </div>
            
            <div className="bg-[#111] p-4 border-l-2 border-murkoff-dark mb-4">
              <p className="text-gray-500 text-xs mb-1">Out [1]:</p>
              <code className="text-murkoff-glitch">
                [CONEXIÓN SEGURA ESTABLECIDA]<br/>
                Filas recuperadas: 4,592,103
              </code>
            </div>
            
            <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-6 py-3 border border-murkoff-glitch text-murkoff-glitch hover:bg-murkoff-glitch hover:text-black transition-colors font-bold uppercase cursor-pointer">
              Acceder al Repositorio Completo en GitHub ↗
            </a>
          </div>
        )}

        {activeFile === 'findings' && (
          <div className="h-full border border-murkoff-blood bg-[#0a0000] p-6 font-typewriter">
            <h3 className="text-murkoff-blood text-xl font-bold mb-4 uppercase tracking-widest border-b border-murkoff-blood pb-2">
              Conclusiones Confidenciales
            </h3>
            
            <div className="space-y-4 text-gray-300 leading-relaxed text-justify">
              <p>
                <span className="text-murkoff-blood font-bold">> RIESGO TERRITORIAL:</span> Los datos indican que las PYMEs de la región de Colchagua presentan una vulnerabilidad crítica ante fluctuaciones [CENSURADO]. Las comunas periféricas muestran una correlación del 0.84 con el abandono de operaciones.
              </p>
              
              <p>
                <span className="text-murkoff-blood font-bold">> HALLAZGO TÉCNICO:</span> Se logró optimizar el proceso ETL reduciendo el tiempo de carga en un 40% al implementar un Datamart estructurado en esquema de estrella. El análisis DAX demostró que [DATOS CORRUPTOS].
              </p>
              
              <p className="border-l-4 border-murkoff-blood pl-4 py-2 bg-black text-sm">
                "La correlación no implica causalidad, pero las anomalías detectadas en los patrones de venta son innegables. Se recomienda vigilancia continua." - <span className="italic">C.A. Rojas Perez</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
