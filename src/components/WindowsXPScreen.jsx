import { useState, useEffect, useRef } from 'react';
import InvestigationFiles from './InvestigationFiles.jsx';

// Sonidos sintéticos nostálgicos de Windows XP generados con Web Audio API
const playXPChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Acorde icónico de inicio de Windows XP: Eb3 -> Bb3 -> Eb4 -> G4 -> Bb4 -> Eb5
    const notes = [155.56, 233.08, 311.13, 392.00, 466.16, 622.25];
    const times = [0.0, 0.12, 0.24, 0.42, 0.65, 0.95];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + times[i]);

      gain.gain.setValueAtTime(0, ctx.currentTime + times[i]);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + times[i] + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + times[i] + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + times[i]);
      osc.stop(ctx.currentTime + times[i] + 2.0);
    });
  } catch (err) { }
};

const playXPClick = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (err) { }
};

export default function WindowsXPScreen({ isZoomedIn = false, onZoomIn = () => { }, onClose = () => { } }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState('crojas');
  const [password, setPassword] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [activeWindow, setActiveWindow] = useState('files'); // 'files' | 'terminal' | 'none'
  const [isMinimized, setIsMinimized] = useState(false);

  // Reloj digital para la bandeja del sistema de XP
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (isLoggingIn || isLoggedIn) return;

    playXPClick();
    setIsLoggingIn(true);

    setTimeout(() => {
      playXPChime();
      setIsLoggedIn(true);
      setIsLoggingIn(false);
      setActiveWindow('files');
    }, 1100);
  };

  const handleLogoff = () => {
    playXPClick();
    setIsLoggedIn(false);
    setIsLoggingIn(false);
    setPassword('');
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden select-none bg-[#00138c] text-white flex flex-col font-sans"
      style={{
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.85)',
      }}
      onClick={(e) => {
        if (!isZoomedIn) {
          onZoomIn();
        }
      }}
    >
      {/* Overlay CRT analógico sutil sobre la pantalla del monitor */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-40"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.12) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {!isLoggedIn ? (
        /* ================= PANTALLA DE INICIO DE SESIÓN WINDOWS XP ================= */
        <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#001384] via-[#002ca6] to-[#001384] relative z-10 w-full h-full">
          {/* Barra superior clásica de Windows XP */}
          <div className="h-20 bg-[#001584] border-b-[4px] border-[#d87c10] flex items-center justify-between px-10 shadow-lg shrink-0">
            <div className="flex items-center gap-4">
              {/* Logotipo de bandera Windows 4 colores */}
              <div className="w-10 h-10 flex flex-wrap gap-1 transform -rotate-12 filter drop-shadow">
                <div className="w-4 h-4 bg-[#f35325] rounded-tl-sm shadow-sm" />
                <div className="w-4 h-4 bg-[#81bc06] rounded-tr-sm shadow-sm" />
                <div className="w-4 h-4 bg-[#05a6f0] rounded-bl-sm shadow-sm" />
                <div className="w-4 h-4 bg-[#ffba08] rounded-br-sm shadow-sm" />
              </div>
              <div className="flex flex-col leading-tight">
                <div className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span className="font-light">Microsoft</span>
                  <span className="font-black italic drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">Windows</span>
                  <span className="text-[#ff9015] font-black text-lg italic ml-1">XP</span>
                </div>
                <span className="text-xs text-blue-200 tracking-wider font-mono">Professional Edition // Murkoff Systems v3.1</span>
              </div>
            </div>

            <div className="text-right text-xs text-blue-200/90 font-mono tracking-widest bg-black/30 px-4 py-1.5 rounded border border-white/10">
              ESTACIÓN: MT-MASSIVE // TERM-04
            </div>
          </div>

          {/* Área Central: Paneles divididos con la línea divisoria vertical brillante de XP */}
          <div className="flex-1 flex items-center justify-center px-10 py-6 relative">
            <div className="w-full max-w-4xl flex items-center justify-center gap-10">
              {/* Columna Izquierda: Mensaje de bienvenida oficial */}
              <div className="w-1/2 text-right pr-10 flex flex-col items-end justify-center select-none">
                <h2 className="text-3xl font-normal text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mb-1">
                  Para comenzar,
                </h2>
                <p className="text-xl font-light text-blue-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] mb-6">
                  haga clic en su nombre de usuario
                </p>
                <div className="bg-black/30 border border-blue-400/30 rounded px-4 py-2 text-right">
                  <div className="text-xs text-blue-300 font-mono font-semibold">MURKOFF PSYCHIATRIC SYSTEMS</div>
                  <div className="text-[11px] text-blue-200/70 font-mono">AUTORIZACIÓN DE SEGURIDAD // NIVEL 3</div>
                </div>
              </div>

              {/* Divisor vertical con degradado blanco suave idéntico a XP */}
              <div className="w-[2px] h-64 bg-gradient-to-b from-transparent via-white/50 to-transparent shrink-0" />

              {/* Columna Derecha: Tarjeta de Usuario con avatar e inputs destacados */}
              <div className="w-1/2 pl-6 flex flex-col justify-center">
                <div className="bg-[#0022a8]/85 p-6 rounded-xl border-2 border-[#ff9015] shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all">
                  <div className="flex items-center gap-5 mb-4">
                    {/* Avatar con marco naranja clásico de Windows XP */}
                    <div className="w-20 h-20 rounded-lg border-2 border-[#ff9015] bg-gradient-to-tr from-[#1b3d73] to-[#4c7fd4] flex items-center justify-center shadow-lg overflow-hidden relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-white/95 mb-2 shadow" />
                      <div className="absolute bottom-0 w-16 h-8 rounded-t-full bg-white/90 shadow" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate">
                        Cristobal A. Rojas Perez
                      </div>
                      <div className="text-sm text-blue-200 font-medium mt-0.5">
                        Consultor de Software // Análisis BI
                      </div>
                      <div className="text-xs text-green-300 flex items-center gap-1.5 mt-1 font-mono">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        SESIÓN ACTIVA PREVIA
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Login */}
                  <form onSubmit={handleLogin} className="space-y-3 mt-3" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="block text-xs text-blue-100 font-medium mb-1">Nombre de usuario:</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white text-black font-sans text-sm rounded-xs border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#ff9015] shadow-inner font-medium"
                        placeholder="Nombre de usuario"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-blue-100 font-medium mb-1">Escriba su contraseña:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white text-black font-sans text-sm rounded-xs border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#ff9015] shadow-inner tracking-widest font-bold"
                          placeholder="••••••••"
                          autoFocus={isZoomedIn}
                        />
                        {/* Botón verde de flecha clásico de Windows XP */}
                        <button
                          type="submit"
                          disabled={isLoggingIn}
                          className="w-10 h-10 bg-gradient-to-b from-[#3ed05e] to-[#24963e] hover:from-[#49e26b] hover:to-[#2cb048] active:from-[#1e7e34] active:to-[#176228] text-white rounded flex items-center justify-center border border-white/60 shadow-md cursor-pointer transition-transform hover:scale-105 shrink-0"
                          title="Iniciar sesión (o pulsa Enter)"
                        >
                          <span className="text-base font-black leading-none drop-shadow">➜</span>
                        </button>
                      </div>
                    </div>

                    {isLoggingIn ? (
                      <div className="text-sm text-[#ffba08] font-bold mt-2 animate-pulse flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ffba08]" />
                        Iniciando sesión en Murkoff Systems...
                      </div>
                    ) : (
                      <div className="text-xs text-[#ffd15c] mt-2 bg-black/35 px-3 py-1.5 rounded border border-[#ff9015]/30 flex items-center gap-2">
                        <span>💡</span>
                        <span>Pista: <strong>Caso Colchagua</strong> (o haz clic en <strong>[➜]</strong> directamente para entrar)</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Barra inferior clásica con botón de apagado */}
          <div className="h-16 bg-[#001584] border-t-[4px] border-[#d87c10] flex items-center justify-between px-10 shadow-inner text-sm shrink-0">
            <button
              onClick={() => {
                playXPClick();
                onClose();
              }}
              className="flex items-center gap-3 px-4 py-2 rounded bg-black/20 hover:bg-white/15 text-white cursor-pointer transition-colors border border-white/20 shadow-sm"
              title="Apagar o volver a la vista del despacho"
            >
              {/* Botón de apagado rojo cuadrado de XP */}
              <div className="w-7 h-7 bg-[#dc3545] rounded-sm flex items-center justify-center border border-white/60 text-xs font-black shadow">
                ⏻
              </div>
              <span className="font-bold text-sm">Apagar equipo</span>
            </button>

            <div className="text-blue-200/70 text-xs font-mono">
              (C) 2013 Murkoff Psychiatric Systems. Todos los derechos reservados.
            </div>
          </div>
        </div>
      ) : (
        /* ================= ESCRITORIO WINDOWS XP (LOGUEADO) ================= */
        <div
          className="flex-1 flex flex-col justify-between relative z-10"
          style={{
            background: 'linear-gradient(135deg, #1f4788 0%, #306eb5 40%, #5b9bd5 75%, #4682b4 100%)',
          }}
        >
          {/* Fondo de colinas verdes estilizado Bliss con marca de agua Murkoff */}
          <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl font-black text-black/25 tracking-widest font-mono">MURKOFF</div>
              <div className="text-sm text-black/20 font-bold tracking-wider">MOUNT MASSIVE PSYCHIATRIC FACILITY</div>
            </div>
          </div>

          {/* Iconos del Escritorio XP */}
          <div className="flex-1 p-4 grid grid-cols-1 gap-4 w-28 pointer-events-auto">
            <div
              onClick={() => {
                playXPClick();
                setActiveWindow('files');
                setIsMinimized(false);
              }}
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/20 cursor-pointer text-center group"
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-amber-200 rounded border border-amber-600 flex items-center justify-center text-xl shadow">
                📁
              </div>
              <span className="text-[11px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] group-hover:bg-[#0055ea] px-1 rounded">
                Expedientes Caso Colchagua
              </span>
            </div>

            <div
              onClick={() => {
                playXPClick();
                setActiveWindow('files');
                setIsMinimized(false);
              }}
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/20 cursor-pointer text-center group"
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-cyan-300 rounded border border-blue-700 flex items-center justify-center text-xl shadow">
                🖥️
              </div>
              <span className="text-[11px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] group-hover:bg-[#0055ea] px-1 rounded">
                Mi PC
              </span>
            </div>
          </div>

          {/* Ventana flotante estilo Windows XP que aloja InvestigationFiles */}
          {activeWindow === 'files' && !isMinimized && (
            <div className="absolute inset-x-6 top-4 bottom-10 z-20 flex flex-col rounded-t-lg shadow-[0_10px_35px_rgba(0,0,0,0.7)] border-2 border-[#0055ea] bg-[#0c120f] overflow-hidden">
              {/* Barra de título azul XP con botón rojo de cerrar */}
              <div className="h-8 bg-gradient-to-r from-[#0055ea] via-[#2a75f0] to-[#0055ea] px-3 flex items-center justify-between select-none shadow">
                <div className="flex items-center gap-2 text-xs font-bold text-white drop-shadow">
                  <span>📂</span>
                  <span>SISTEMA DE ANÁLISIS DE DATOS // CASO COLCHAGUA (PYMES)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-5 h-5 bg-[#0044c0] hover:bg-[#2060e0] text-white text-[10px] font-bold rounded-sm border border-white/40 flex items-center justify-center cursor-pointer"
                  >
                    _
                  </button>
                  <button
                    onClick={handleLogoff}
                    className="w-5 h-5 bg-[#dc3545] hover:bg-[#ff4d5a] text-white text-[11px] font-bold rounded-sm border border-white/40 flex items-center justify-center cursor-pointer shadow"
                    title="Cerrar y volver al login"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Menú de herramientas clásico de Windows */}
              <div className="h-6 bg-[#ece9d8] text-black text-[11px] px-3 flex items-center gap-4 border-b border-gray-300 font-sans">
                <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Archivo</span>
                <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Edición</span>
                <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Ver</span>
                <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Herramientas</span>
                <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Ayuda</span>
              </div>

              {/* Contenido interactivo: InvestigationFiles de Cristobal */}
              <div className="flex-1 overflow-y-auto bg-[#030604] p-2 text-white">
                <InvestigationFiles />
              </div>
            </div>
          )}

          {/* Barra de Tareas de Windows XP (Taskbar con botón verde Inicio) */}
          <div className="h-9 bg-gradient-to-r from-[#245ddb] via-[#2a68e8] to-[#1642a8] border-t-2 border-[#3b82f6] flex items-center justify-between px-1 z-30 shadow-2xl">
            <div className="flex items-center gap-1.5 h-full">
              {/* Botón verde "Inicio" icónico con curvatura derecha */}
              <button
                onClick={handleLogoff}
                className="h-full px-3.5 bg-gradient-to-r from-[#388e3c] to-[#4caf50] hover:from-[#43a047] hover:to-[#66bb6a] rounded-r-xl flex items-center gap-2 border-r-2 border-green-800 text-white font-bold italic text-sm shadow cursor-pointer transition-all"
                title="Cerrar sesión / Salir"
              >
                <div className="w-4 h-4 flex flex-wrap gap-0.5 transform -rotate-12">
                  <div className="w-1.5 h-1.5 bg-[#f35325] rounded-tl-sm" />
                  <div className="w-1.5 h-1.5 bg-[#81bc06] rounded-tr-sm" />
                  <div className="w-1.5 h-1.5 bg-[#05a6f0] rounded-bl-sm" />
                  <div className="w-1.5 h-1.5 bg-[#ffba08] rounded-br-sm" />
                </div>
                <span>inicio</span>
              </button>

              {/* Pestaña de tarea abierta */}
              {activeWindow === 'files' && (
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className={`h-7 px-3 text-xs flex items-center gap-2 rounded border font-medium cursor-pointer transition-all ${!isMinimized ? 'bg-[#1b4396] border-[#0f2a66] text-white shadow-inner' : 'bg-[#3b75e8] border-[#558cf4] text-white/90'
                    }`}
                >
                  <span>📁</span>
                  <span className="truncate max-w-[140px]">Expedientes Colchagua</span>
                </button>
              )}
            </div>

            {/* Bandeja del sistema (System Tray) */}
            <div className="h-full bg-[#0b80ef] px-3 flex items-center gap-3 border-l border-[#0860b8] text-[11px] font-sans">
              <button
                onClick={handleLogoff}
                className="text-[10px] text-white hover:underline cursor-pointer font-bold"
              >
                [Cerrar sesión]
              </button>
              <div className="flex items-center gap-1.5 text-white/90">
                <span>🛡️</span>
                <span>🔊</span>
                <span className="font-mono text-xs">{currentTime || '10:43 PM'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
