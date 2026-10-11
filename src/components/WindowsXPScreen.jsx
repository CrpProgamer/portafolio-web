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
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
          backgroundSize: '100% 3px, 4px 100%',
        }}
      />

      {!isLoggedIn ? (
        /* ================= PANTALLA DE INICIO DE SESIÓN WINDOWS XP ================= */
        <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#001170] via-[#00289a] to-[#001170] relative z-10">
          {/* Barra superior clásica de Windows XP */}
          <div className="h-16 bg-[#001584] border-b-[3px] border-[#d87c10] flex items-center justify-between px-8 shadow-md">
            <div className="flex items-center gap-3">
              {/* Logotipo de bandera Windows 4 colores */}
              <div className="w-8 h-8 flex flex-wrap gap-0.5 transform -rotate-12">
                <div className="w-3.5 h-3.5 bg-[#f35325] rounded-tl-sm shadow-sm" />
                <div className="w-3.5 h-3.5 bg-[#81bc06] rounded-tr-sm shadow-sm" />
                <div className="w-3.5 h-3.5 bg-[#05a6f0] rounded-bl-sm shadow-sm" />
                <div className="w-3.5 h-3.5 bg-[#ffba08] rounded-br-sm shadow-sm" />
              </div>
              <div className="flex flex-col leading-tight">
                <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  <span>Microsoft</span>
                  <span className="text-white font-extrabold italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Windows</span>
                  <span className="text-[#ff9015] font-black text-sm italic ml-0.5">XP</span>
                </div>
                <span className="text-[10px] text-blue-200 uppercase tracking-widest font-mono">Professional // Murkoff Systems v3.1</span>
              </div>
            </div>

            <div className="text-right text-xs text-blue-200/80 font-mono hidden sm:block">
              ESTACIÓN: MT-MASSIVE // TERM-04
            </div>
          </div>

          {/* Área Central: Paneles divididos con el usuario y contraseña */}
          <div className="flex-1 flex items-center justify-center px-6 py-4">
            <div className="w-full max-w-2xl flex items-center justify-center gap-8">
              {/* Columna Izquierda: Instrucción de bienvenida */}
              <div className="w-1/2 text-right border-r-2 border-white/20 pr-8 hidden md:block">
                <h3 className="text-xl font-semibold text-white drop-shadow mb-2">Para comenzar</h3>
                <p className="text-sm text-blue-200 leading-relaxed">
                  Haga clic en su nombre de usuario e ingrese sus credenciales de seguridad de Murkoff Corporation.
                </p>
                <div className="mt-4 text-xs text-blue-300/60 font-mono">
                  ACCESO AUTORIZADO NIVEL 3
                </div>
              </div>

              {/* Columna Derecha: Tarjeta de Usuario con inputs */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <div className="bg-[#001d8f]/80 p-4 rounded-lg border-2 border-[#ff9015] shadow-2xl backdrop-blur-sm transition-all hover:bg-[#0024aa]">
                  <div className="flex items-center gap-4 mb-3">
                    {/* Avatar con borde naranja clásico */}
                    <div className="w-14 h-14 rounded-md border-2 border-white/90 bg-gradient-to-tr from-[#1b3d73] to-[#4c7fd4] flex items-center justify-center shadow-md overflow-hidden relative">
                      <div className="w-7 h-7 rounded-full bg-white/90 mb-1" />
                      <div className="absolute bottom-0 w-11 h-6 rounded-t-full bg-white/80" />
                    </div>

                    <div className="flex-1">
                      <div className="font-bold text-base text-white drop-shadow">
                        Cristobal A. Rojas Perez
                      </div>
                      <div className="text-xs text-blue-200">
                        Consultor de Software // Análisis
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Login */}
                  <form onSubmit={handleLogin} className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="block text-[11px] text-blue-200 mb-0.5">Usuario:</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-2 py-1 bg-white text-black font-sans text-xs rounded border border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#ff9015]"
                        placeholder="Nombre de usuario"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-blue-200 mb-0.5">Contraseña:</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 px-2 py-1 bg-white text-black font-sans text-xs rounded border border-blue-400 focus:outline-none focus:ring-2 focus:ring-[#ff9015]"
                          placeholder="••••••••"
                          autoFocus={isZoomedIn}
                        />
                        {/* Botón verde de flecha clásico de Windows XP */}
                        <button
                          type="submit"
                          disabled={isLoggingIn}
                          className="w-7 h-7 bg-[#28a745] hover:bg-[#34c759] active:bg-[#1e7e34] text-white rounded flex items-center justify-center border border-white/40 shadow cursor-pointer transition-transform hover:scale-105"
                          title="Iniciar sesión"
                        >
                          <span className="text-xs font-bold leading-none">➜</span>
                        </button>
                      </div>
                    </div>

                    {isLoggingIn ? (
                      <div className="text-xs text-[#ffba08] font-semibold mt-2 animate-pulse flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#ffba08]" />
                        Iniciando sesión en Murkoff Corp...
                      </div>
                    ) : (
                      <div className="text-[10px] text-blue-300/70 mt-1.5">
                        Pista: Caso Colchagua (o pulsa [➜] directamente para entrar)
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Barra inferior clásica con botón de apagado */}
          <div className="h-14 bg-[#001584] border-t-[3px] border-[#d87c10] flex items-center justify-between px-6 shadow-inner text-xs">
            <button
              onClick={() => {
                playXPClick();
                onClose();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-transparent hover:bg-white/10 text-white cursor-pointer transition-colors"
            >
              {/* Botón de apagado rojo cuadrado de XP */}
              <div className="w-5 h-5 bg-[#dc3545] rounded-sm flex items-center justify-center border border-white/50 text-[10px] font-bold shadow">
                ⏻
              </div>
              <span className="font-semibold text-xs">Apagar o salir</span>
            </button>

            <div className="text-blue-200/60 text-[11px] font-mono">
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
