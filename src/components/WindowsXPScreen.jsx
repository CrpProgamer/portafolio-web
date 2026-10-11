import { useState, useEffect, useRef } from 'react';

// Reproducción de efectos de sonido mediante archivos .wav
const playXPChime = () => {
  try {
    const audio = new Audio('/assets/sounds/xp_startup.wav');
    audio.volume = 0.8;
    audio.play().catch(() => {});
  } catch (err) {}
};

const playXPClick = () => {
  try {
    const audio = new Audio('/assets/sounds/xp_click.wav');
    audio.volume = 0.6;
    audio.play().catch(() => {});
  } catch (err) {}
};

const playTerminalBeep = () => {
  try {
    const audio = new Audio('/assets/sounds/terminal_beep.wav');
    audio.volume = 0.45;
    audio.play().catch(() => {});
  } catch (err) {}
};

export default function WindowsXPScreen({ isZoomedIn = false, onZoomIn = () => {}, onClose = () => {} }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState('crojas');
  const [password, setPassword] = useState('');

  // Estados de la consola interactiva (Foto de referencia Outlast)
  const [commandInput, setCommandInput] = useState('');
  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'header', text: 'Murkoff Analytics System Console {version 1.04}' },
    { type: 'sub', text: '2026 Murkoff Corporation // Terminal: Cristóbal Rojas' },
    { type: 'spacer' },
    { type: 'prompt', text: '>SystemCheck  //Cristobal_Rojas' },
    { type: 'ok', text: '[OK] NÚCLEO DE DATOS: MURKOFF BI OS v3.1 ACTIVO' },
    { type: 'ok', text: '[OK] ANALISTA ASIGNADO: CRISTÓBAL A. ROJAS PÉREZ' },
    { type: 'ok', text: '[OK] ESPECIALIDAD: INGENIERÍA DE DATOS & BUSINESS INTELLIGENCE' },
    { type: 'ok', text: '[OK] PIPELINE ACTIVO: CASO COLCHAGUA (PYMES) CONECTADO' },
    { type: 'ok', text: '[OK] STACK TÉCNICO: SQL, PYTHON, POWER BI, POSTGRESQL, ETL' },
    { type: 'info', text: 'Escribe "ayuda" o "proyectos" para explorar expedientes clasificados.' },
  ]);

  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs, isLoggedIn]);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (isLoggingIn || isLoggedIn) return;

    playXPClick();
    setIsLoggingIn(true);

    setTimeout(() => {
      playXPChime();
      setIsLoggedIn(true);
      setIsLoggingIn(false);
    }, 950);
  };

  const handleLogoff = () => {
    playXPClick();
    setIsLoggedIn(false);
    setIsLoggingIn(false);
    setPassword('');
  };

  const executeCommand = (cmdText) => {
    const cleanCmd = (cmdText || commandInput).trim().toLowerCase();
    if (!cleanCmd) return;

    playTerminalBeep();
    const newLogs = [...consoleLogs, { type: 'input', text: `>${cmdText || commandInput}` }];

    if (cleanCmd === 'ayuda' || cleanCmd === 'help') {
      newLogs.push(
        { type: 'info', text: 'COMANDOS DISPONIBLES EN TERMINAL MURKOFF:' },
        { type: 'text', text: '  proyectos    - Ver expedientes de Caso Colchagua y análisis BI' },
        { type: 'text', text: '  habilidades  - Listar stack técnico y tecnologías' },
        { type: 'text', text: '  contacto     - Canales de comunicación directa' },
        { type: 'text', text: '  limpiar      - Limpiar el búfer de la consola' },
        { type: 'text', text: '  check        - Ejecutar diagnóstico del sistema' },
        { type: 'text', text: '  salir        - Cerrar sesión y volver al login' }
      );
    } else if (cleanCmd === 'proyectos' || cleanCmd === 'projects') {
      newLogs.push(
        { type: 'highlight', text: '=== EXPEDIENTE PRINCIPAL: CASO COLCHAGUA (PYMES) ===' },
        { type: 'text', text: '• Diagnóstico y transformación analítica para toma de decisiones.' },
        { type: 'text', text: '• Pipeline ETL en Python con ingesta y normalización en PostgreSQL.' },
        { type: 'text', text: '• Modelo Estrella optimizado con medidas DAX avanzadas.' },
        { type: 'text', text: '• Dashboard interactivo en Power BI con KPIs de liquidez y margen.' },
        { type: 'ok', text: '[ESTADO: EXPEDIENTE CLASIFICADO Y VERIFICADO POR CRISTÓBAL ROJAS]' }
      );
    } else if (cleanCmd === 'habilidades' || cleanCmd === 'skills') {
      newLogs.push(
        { type: 'highlight', text: '=== STACK TECNOLÓGICO & COMPETENCIAS ===' },
        { type: 'text', text: '• Análisis de Datos: Power BI, DAX, Power Query, Excel Avanzado' },
        { type: 'text', text: '• Bases de Datos: SQL Server, PostgreSQL, MySQL, Modelado Dimensional' },
        { type: 'text', text: '• Programación & ETL: Python (Pandas, NumPy, SQLAlchemy), Pipelines' },
        { type: 'text', text: '• Desarrollo Frontend & 3D: React, Three.js, Astro, Tailwind CSS' },
        { type: 'ok', text: '[NIVEL DE HABILIDAD: PROFESIONAL COMPROBADO]' }
      );
    } else if (cleanCmd === 'contacto' || cleanCmd === 'contact') {
      newLogs.push(
        { type: 'highlight', text: '=== CANALES DE CONTACTO OFICIALES ===' },
        { type: 'text', text: '• LinkedIn: https://www.linkedin.com' },
        { type: 'text', text: '• GitHub: https://github.com/CrpProgamer' },
        { type: 'text', text: '• Email: cristobal.rojas.perez@example.com' },
        { type: 'info', text: 'Disponible para contratación y proyectos de Business Intelligence.' }
      );
    } else if (cleanCmd === 'limpiar' || cleanCmd === 'clear') {
      setConsoleLogs([
        { type: 'header', text: 'Murkoff Analytics System Console {version 1.04}' },
        { type: 'prompt', text: '>SystemCheck  //Cristobal_Rojas' },
      ]);
      setCommandInput('');
      return;
    } else if (cleanCmd === 'check' || cleanCmd === 'systemcheck') {
      newLogs.push(
        { type: 'ok', text: '[OK] TODOS LOS SUBSISTEMAS OPERANDO AL 100%' },
        { type: 'ok', text: '[OK] TELEMETRÍA DE DATOS ESTABLE' }
      );
    } else if (cleanCmd === 'salir' || cleanCmd === 'exit' || cleanCmd === 'logout') {
      handleLogoff();
      return;
    } else {
      newLogs.push({
        type: 'error',
        text: `Error: Comando desconocido "${cleanCmd}". Escribe "ayuda" para la lista de comandos.`,
      });
    }

    setConsoleLogs(newLogs);
    setCommandInput('');
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    executeCommand();
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden select-none bg-[#00138c] text-white flex flex-col font-sans"
      style={{
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.85)',
      }}
      onClick={() => {
        if (!isZoomedIn) {
          onZoomIn();
        }
      }}
    >
      {/* Overlay CRT analógico de líneas de escaneo sobre el fósforo del monitor */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-35"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.18) 50%)',
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
                <span className="text-xs text-blue-200 tracking-wider font-mono">Professional // Murkoff Terminal v3.1</span>
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
                        Cristóbal A. Rojas Pérez
                      </div>
                      <div className="text-sm text-blue-200 font-medium mt-0.5">
                        Consultor de Software // Análisis BI
                      </div>
                      <div className="text-xs text-green-300 flex items-center gap-1.5 mt-1 font-mono">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        SESIÓN LISTA
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
                        <span>Haz clic en <strong>[➜]</strong> o pulsa <strong>Enter</strong> para acceder a la consola</span>
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
              <div className="w-7 h-7 bg-[#dc3545] rounded-sm flex items-center justify-center border border-white/60 text-xs font-black shadow">
                ⏻
              </div>
              <span className="font-bold text-sm">Apagar equipo</span>
            </button>

            <div className="text-blue-200/70 text-xs font-mono">
              (C) 2026 Murkoff Psychiatric Systems. Todos los derechos reservados.
            </div>
          </div>
        </div>
      ) : (
        /* ================= CONSOLA ESTILO OUTLAST TRAS INICIAR SESIÓN (Referencia de la foto) ================= */
        <div
          className="flex-1 w-full h-full relative z-10 p-6 flex flex-col justify-between overflow-hidden select-none font-mono"
          style={{
            backgroundColor: '#2b475e', // Fondo de escritorio azul pizarra clásico de la captura
          }}
        >
          {/* 1. VENTANA DE FONDO: "Morphogenic Engine POD 2" con diagnósticos en rojo (como en la foto) */}
          <div
            className="absolute top-4 right-4 w-[480px] h-[480px] bg-[#060a0d] border-2 border-[#c0c0c0] shadow-2xl flex flex-col z-0 pointer-events-none opacity-85"
            style={{
              boxShadow: 'inset 1px 1px 0px #ffffff, inset -1px -1px 0px #808080, 5px 5px 25px rgba(0,0,0,0.8)',
            }}
          >
            {/* Barra de título clásica Windows gris */}
            <div className="h-6 bg-[#c0c0c0] text-black text-xs font-bold px-2 flex items-center justify-between border-b border-[#808080]">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">⚙️</span>
                <span className="tracking-wider">Morphogenic Engine POD 2 // Analytics</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="w-3.5 h-3.5 bg-[#c0c0c0] border border-[#808080] text-[9px] flex items-center justify-center leading-none">_</span>
                <span className="w-3.5 h-3.5 bg-[#c0c0c0] border border-[#808080] text-[9px] flex items-center justify-center leading-none">⛶</span>
                <span className="w-3.5 h-3.5 bg-[#c0c0c0] border border-[#808080] text-[9px] flex items-center justify-center leading-none">✕</span>
              </div>
            </div>

            {/* Diagnóstico en rojo streaming idéntico a la imagen de Outlast */}
            <div className="flex-1 p-3 text-red-600 font-mono text-[11px] leading-snug overflow-hidden flex flex-col justify-end">
              <div className="text-xl font-black text-red-600 tracking-wider mb-2 animate-pulse">
                SYSTEM ERROR // ACTIVE
              </div>
              <div className="opacity-90 space-y-0.5 text-[10px]">
                <div>0:00 0EAC123:5F89A // MEM_INIT</div>
                <div>0:00 0EAC123:9B41C // ETL_STREAM</div>
                <div>2:00 AEEAC12:4409D // POD_ONLINE</div>
                <div>391F 34F542E1 // BUFFER_SYNC</div>
                <div>0:00 0EAC123:5F89A // DW_FACT_READY</div>
                <div>2:00 AEEAC12:8871B // PBI_LINKED</div>
                <div>0:00 0EAC123:5F89A // COLCHAGUA_OK</div>
                <div className="text-red-500 font-bold">system/developer/analytics</div>
                <div className="text-red-500 font-bold">system/developer/caso_colchagua</div>
                <div className="text-red-500 font-bold">system/developer/data_lake</div>
                <div className="text-red-500 font-bold">system/morphogenic/rojas_core</div>
                <div className="text-red-500 font-bold">system/developer/power_bi</div>
              </div>
            </div>
          </div>

          {/* 2. VENTANA PRINCIPAL DE PRIMER PLANO: "Console" (100% idéntica a la captura de Outlast) */}
          <div
            className="relative z-10 w-[640px] max-w-[95%] h-[530px] bg-black border-2 border-[#d4d0c8] shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col"
            style={{
              boxShadow: 'inset 2px 2px 0px #ffffff, inset -2px -2px 0px #808080, 8px 8px 35px rgba(0,0,0,0.9)',
            }}
          >
            {/* Barra de Título Gris Clásica Windows con controles _ ⛶ ✕ */}
            <div className="h-7 bg-[#c0c0c0] text-black text-xs font-bold px-2 flex items-center justify-between border-b-2 border-[#808080] select-none shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-black font-mono text-sm leading-none">█</span>
                <span className="tracking-wider text-black text-sm">Console</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleLogoff}
                  className="w-4 h-4 bg-[#c0c0c0] hover:bg-[#d8d8d8] active:bg-[#a0a0a0] border border-[#808080] text-black text-[10px] font-bold flex items-center justify-center leading-none cursor-pointer"
                  title="Minimizar"
                >
                  _
                </button>
                <button
                  className="w-4 h-4 bg-[#c0c0c0] hover:bg-[#d8d8d8] active:bg-[#a0a0a0] border border-[#808080] text-black text-[10px] font-bold flex items-center justify-center leading-none cursor-pointer"
                  title="Maximizar"
                >
                  ⛶
                </button>
                <button
                  onClick={handleLogoff}
                  className="w-4 h-4 bg-[#c0c0c0] hover:bg-red-500 hover:text-white active:bg-red-700 border border-[#808080] text-black text-[11px] font-bold flex items-center justify-center leading-none cursor-pointer"
                  title="Cerrar sesión"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Cuerpo de la Consola: Fondo negro, texto blanco y scrollbar idéntica a la referencia */}
            <div className="flex-1 bg-black text-white p-4 overflow-y-auto font-mono text-xs leading-relaxed flex flex-col justify-between">
              <div className="space-y-1.5">
                {consoleLogs.map((log, idx) => {
                  if (log.type === 'header') {
                    return (
                      <div key={idx} className="font-bold text-white text-sm tracking-wide">
                        {log.text}
                      </div>
                    );
                  }
                  if (log.type === 'sub') {
                    return (
                      <div key={idx} className="text-white/80 text-xs">
                        {log.text}
                      </div>
                    );
                  }
                  if (log.type === 'prompt') {
                    return (
                      <div key={idx} className="text-white font-bold text-sm pt-2">
                        {log.text}
                      </div>
                    );
                  }
                  if (log.type === 'ok') {
                    return (
                      <div key={idx} className="text-green-400 font-medium">
                        {log.text}
                      </div>
                    );
                  }
                  if (log.type === 'highlight') {
                    return (
                      <div key={idx} className="text-[#38bdf8] font-bold pt-1">
                        {log.text}
                      </div>
                    );
                  }
                  if (log.type === 'info') {
                    return (
                      <div key={idx} className="text-yellow-300 font-medium pt-1">
                        {log.text}
                      </div>
                    );
                  }
                  if (log.type === 'error') {
                    return (
                      <div key={idx} className="text-red-400 font-medium">
                        {log.text}
                      </div>
                    );
                  }
                  if (log.type === 'input') {
                    return (
                      <div key={idx} className="text-white font-bold pt-1">
                        {log.text}
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="text-white/90">
                      {log.text}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>

              {/* Entrada interactiva de comandos con cursor parpadeante */}
              <div className="pt-3 border-t border-white/20 mt-3">
                <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">{'>'}</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Escribe un comando (ej: proyectos, ayuda)..."
                    className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-white/40"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2 py-0.5 bg-white/10 hover:bg-white/25 border border-white/30 text-[10px] text-white cursor-pointer uppercase font-mono"
                  >
                    EJECUTAR
                  </button>
                </form>

                {/* Accesos rápidos de un clic para comodidad del usuario */}
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-white/10 text-[10px]">
                  <span className="text-white/40 self-center">ACCESOS RÁPIDOS:</span>
                  {['proyectos', 'habilidades', 'contacto', 'check', 'limpiar'].map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => executeCommand(cmd)}
                      className="px-2 py-0.5 bg-white/5 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white rounded-xs cursor-pointer uppercase transition-colors"
                    >
                      [{cmd}]
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. BARRA INFERIOR DEL SISTEMA (Botones para cerrar sesión o salir de la pantalla) */}
          <div className="relative z-10 w-full flex justify-between items-center bg-[#1e3447]/90 border border-white/20 px-4 py-2 rounded text-xs text-white shadow-lg backdrop-blur-sm mt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogoff}
                className="px-3 py-1 bg-red-900/80 hover:bg-red-800 border border-red-500 text-white font-bold rounded-xs cursor-pointer transition-colors shadow"
                title="Cerrar sesión actual en el sistema"
              >
                ← CERRAR SESIÓN
              </button>
              <span className="text-white/60 text-[11px]">
                USUARIO: <strong>CRISTOBAL ROJAS</strong> // NIVEL 3
              </span>
            </div>

            <button
              onClick={() => {
                playXPClick();
                onClose();
              }}
              className="px-4 py-1 bg-black/60 hover:bg-white/15 border border-white/30 text-white font-bold rounded-xs cursor-pointer transition-colors shadow"
              title="Alejar la vista y volver al despacho 3D"
            >
              [⏻ SALIR DEL MONITOR]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
