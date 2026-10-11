import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audioManager.js';

export default function OutlastMainMenu({ onStartGame, onResetGame }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeModal, setActiveModal] = useState(null); // 'options' | 'contact' | 'credits' | null
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Opciones de audio y gráficos
  const [sfxVolume, setSfxVolume] = useState(80);
  const [grainEnabled, setGrainEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Menú principal idéntico a las referencias (Fotos 1 y 2)
  const menuItems = [
    { id: 'continue', label: 'Continuar' },
    { id: 'new_game', label: 'Nueva partida' },
    { id: 'options', label: 'Opciones' },
    { id: 'contact', label: 'Contacto' },
    { id: 'credits', label: 'Créditos' },
  ];

  const playHoverSound = () => {
    playSound('xp_click', 0.25);
  };

  const playSelectSound = () => {
    playSound('camera_pickup', 0.6);
  };

  const handleSelect = (index) => {
    const item = menuItems[index];
    playSelectSound();

    if (item.id === 'continue') {
      launchGame(false);
    } else if (item.id === 'new_game') {
      if (onResetGame) onResetGame();
      launchGame(true);
    } else if (item.id === 'options') {
      setActiveModal('options');
    } else if (item.id === 'contact') {
      setActiveModal('contact');
    } else if (item.id === 'credits') {
      setActiveModal('credits');
    }
  };

  const launchGame = (reset = false) => {
    setIsTransitioning(true);
    setTimeout(() => {
      onStartGame();
    }, 700);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Navegación con teclado (Flechas Arriba/Abajo, Enter, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeModal) {
        if (e.key === 'Escape') setActiveModal(null);
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        playHoverSound();
        setSelectedIdx((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        playHoverSound();
        setSelectedIdx((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(selectedIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, activeModal]);

  return (
    <div className="fixed inset-0 z-50 bg-black select-none overflow-hidden font-typewriter outlast-cursor">
      {/* 1. Fondo atmosférico de pasillo con silla de ruedas en visión nocturna (Fotos 1 y 2) */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/assets/images/menu_bg.jpg"
          alt="Outlast Asylum Corridor"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-110 scale-100 animate-[pulse_10s_ease-in-out_infinite]"
        />

        {/* Tinte verde de visión nocturna phosphor de Outlast */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(10, 48, 25, 0.4) 0%, rgba(3, 12, 6, 0.85) 75%, rgba(0, 4, 1, 0.98) 100%)',
            mixBlendMode: 'multiply',
          }}
        />

        {/* Scanlines analógicas de sensor */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.45) 0px, rgba(0, 0, 0, 0.45) 1px, transparent 1px, transparent 3px)',
            backgroundSize: '100% 3px',
          }}
        />

        {/* Grano analógico CMOS de alta frecuencia */}
        {grainEnabled && (
          <div
            className="absolute inset-0 mix-blend-overlay outlast-grain-animation pointer-events-none opacity-25"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '160px 160px',
            }}
          />
        )}

        {/* Viñeteado oscuro en bordes */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.95)]" />
      </div>

      {/* 2. Capa Principal del Menú */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between items-center py-10 md:py-16 px-6">
        {/* LOGOTIPO GRUNGE ESTILO OUTLAST (Foto 1) */}
        <div className="text-center pt-4 md:pt-8 flex flex-col items-center">
          <div className="relative inline-block">
            {/* Título Principal PORTAFOLIO con desgaste y tachadura sobre la A */}
            <h1
              className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-[0.18em] uppercase drop-shadow-[0_4px_25px_rgba(255,255,255,0.35)]"
              style={{
                fontFamily: '"Courier Prime", Courier, monospace',
                textShadow: '0 0 20px rgba(180, 255, 200, 0.4), 0 0 50px rgba(0,0,0,0.9)',
                letterSpacing: '0.22em',
              }}
            >
              PORT<span className="relative inline-block">A<span className="absolute -top-3 left-0 right-0 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" /></span>FOLIO
            </h1>
          </div>

          {/* Subtítulo oficial del analista */}
          <div className="mt-3 flex items-center gap-3 text-white/75 font-mono text-xs sm:text-sm tracking-[0.45em] uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>CRISTÓBAL ROJAS // BUSINESS INTELLIGENCE</span>
          </div>
        </div>

        {/* LISTA DE OPCIONES DEL MENÚ CON LA CÁPSULA OVALADA (Fotos 1 y 2) */}
        <div className="w-full max-w-md flex flex-col items-center gap-3.5 my-auto">
          {menuItems.map((item, index) => {
            const isSelected = selectedIdx === index;
            return (
              <div
                key={item.id}
                onMouseEnter={() => {
                  setSelectedIdx(index);
                  playHoverSound();
                }}
                onClick={() => handleSelect(index)}
                className="relative flex items-center justify-center w-full cursor-pointer py-1.5"
              >
                {/* Cápsula ovalada translúcida idéntica a la referencia de Outlast (Foto 2) */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-full bg-white/10 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.3),inset_0_0_12px_rgba(255,255,255,0.15)] backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150 pointer-events-none" />
                )}

                {/* Texto de la opción en Courier Prime con espaciado amplio */}
                <span
                  className={`relative z-10 text-lg sm:text-xl font-bold tracking-[0.25em] transition-all duration-150 ${
                    isSelected
                      ? 'text-white scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]'
                      : 'text-white/60 hover:text-white/85'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pie de página con versión e instrucciones */}
        <div className="w-full max-w-4xl flex justify-between items-center text-white/40 font-mono text-[11px] tracking-widest px-4 border-t border-white/10 pt-3">
          <span>MURKOFF CORP // SISTEMAS v3.1</span>
          <span className="hidden sm:inline">Usa [↑ / ↓] para navegar • [ENTER] para seleccionar</span>
          <span>© 2026 CRISTÓBAL ROJAS</span>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: OPCIONES (AUDIO, GRÁFICOS, PANTALLA)
      ========================================================================= */}
      {activeModal === 'options' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0e1410] border border-white/20 p-8 rounded shadow-2xl text-white font-typewriter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-white/20 pb-3 mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-[0.25em] uppercase text-white">OPCIONES</h2>
              <span className="text-xs text-white/40 font-mono">AJUSTES DEL SISTEMA</span>
            </div>

            <div className="space-y-6 text-sm">
              {/* Volumen de efectos de sonido */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs tracking-wider">
                  <span className="text-white/80">VOLUMEN DE EFECTOS SONOROS (.WAV)</span>
                  <span className="text-green-400 font-mono">{sfxVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(parseInt(e.target.value, 10))}
                  className="w-full accent-green-500 cursor-pointer"
                />
              </div>

              {/* Grano analógico de cámara */}
              <div className="flex justify-between items-center py-2 border-t border-white/10">
                <span className="text-white/80 text-xs tracking-wider">RUIDO / GRANO DE VIDEOCÁMARA</span>
                <button
                  onClick={() => setGrainEnabled(!grainEnabled)}
                  className={`px-4 py-1 rounded text-xs font-mono font-bold border transition-colors ${
                    grainEnabled
                      ? 'bg-green-950 border-green-500 text-green-300'
                      : 'bg-black border-white/20 text-white/40'
                  }`}
                >
                  {grainEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
                </button>
              </div>

              {/* Pantalla completa */}
              <div className="flex justify-between items-center py-2 border-t border-white/10">
                <span className="text-white/80 text-xs tracking-wider">PANTALLA COMPLETA</span>
                <button
                  onClick={toggleFullscreen}
                  className="px-4 py-1 rounded text-xs font-mono font-bold bg-white/10 hover:bg-white/20 border border-white/30 text-white cursor-pointer transition-colors"
                >
                  {isFullscreen ? 'VENTANA' : 'PANTALLA COMPLETA'}
                </button>
              </div>
            </div>

            {/* Botón Atrás con la cápsula ovalada de Outlast */}
            <div className="flex justify-center mt-8 pt-4 border-t border-white/10">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full bg-white/10 hover:bg-white/20 border border-white/30 px-10 py-1.5 text-white font-mono text-sm tracking-[0.35em] uppercase transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                A t r á s
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CONTACTO (LINKS, EMAIL, LINKEDIN, GITHUB)
      ========================================================================= */}
      {activeModal === 'contact' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#0e1410] border border-white/20 p-8 md:p-10 rounded shadow-2xl text-white font-typewriter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-white/20 pb-3 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-[0.25em] uppercase text-white">CANALES DE CONTACTO</h2>
                <p className="text-xs text-white/50 font-mono mt-0.5">TRANSMISIÓN DIRECTA // CRISTÓBAL ROJAS</p>
              </div>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="space-y-4 text-sm">
              <p className="text-white/70 text-xs leading-relaxed">
                Disponible para oportunidades en <strong className="text-white">Business Intelligence, Análisis de Datos y Arquitectura de Datos</strong>.
              </p>

              <div className="space-y-3 pt-2">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded bg-white/5 hover:bg-white/10 border border-white/15 hover:border-blue-400 text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 font-bold text-lg font-mono">in</span>
                    <span className="font-medium tracking-wider">LinkedIn Profesional</span>
                  </div>
                  <span className="text-xs text-white/40 group-hover:text-blue-300 font-mono">Abrir ↗</span>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/CrpProgamer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded bg-white/5 hover:bg-white/10 border border-white/15 hover:border-green-400 text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-bold text-lg font-mono">GH</span>
                    <span className="font-medium tracking-wider">GitHub // Repositorios y Código</span>
                  </div>
                  <span className="text-xs text-white/40 group-hover:text-green-300 font-mono">Ver Repos ↗</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:cristobal.rojas.perez@example.com"
                  className="flex items-center justify-between p-3 rounded bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#ff9015] text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#ff9015] font-bold text-lg font-mono">@</span>
                    <span className="font-medium tracking-wider">Correo Electrónico Directo</span>
                  </div>
                  <span className="text-xs text-white/40 group-hover:text-[#ff9015] font-mono">Enviar Correo ↗</span>
                </a>
              </div>
            </div>

            {/* Botón Atrás con la cápsula ovalada */}
            <div className="flex justify-center mt-8 pt-4 border-t border-white/10">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full bg-white/10 hover:bg-white/20 border border-white/30 px-10 py-1.5 text-white font-mono text-sm tracking-[0.35em] uppercase transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                A t r á s
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: CRÉDITOS & EXPEDIENTE
      ========================================================================= */}
      {activeModal === 'credits' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0e1410] border border-white/20 p-8 rounded shadow-2xl text-white font-typewriter text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold tracking-[0.25em] uppercase text-white mb-1">CRÉDITOS</h2>
            <p className="text-xs text-white/50 font-mono mb-6">PORTAFOLIO INTERACTIVO // CRISTÓBAL ROJAS</p>

            <div className="space-y-4 text-xs sm:text-sm text-white/80 leading-relaxed text-justify">
              <p>
                Este portafolio es una experiencia inmersiva que recrea la atmósfera psicológica y analógica de supervivencia de Mount Massive Asylum, fusionada con proyectos reales de ingeniería y análisis de datos.
              </p>
              <p>
                <strong>Desarrollado con:</strong> Astro, React Three Fiber, Three.js, Tailwind CSS y Web Audio API.
              </p>
              <p className="text-white/50 text-[11px] pt-2">
                Homenaje no comercial a la saga Outlast (propiedad de Red Barrels Inc.). Todos los datos analíticos, pipelines de ETL y dashboards corresponden al trabajo técnico de Cristóbal Rojas Pérez.
              </p>
            </div>

            <div className="flex justify-center mt-8 pt-4 border-t border-white/10">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-full bg-white/10 hover:bg-white/20 border border-white/30 px-10 py-1.5 text-white font-mono text-sm tracking-[0.35em] uppercase transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                A t r á s
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transición cinemática de fundido a negro al iniciar partida */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-black pointer-events-none animate-camera-blink" />
      )}
    </div>
  );
}
