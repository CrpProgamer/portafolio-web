import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/audioManager.js';

// Reproducción de efectos de sonido de la cámara mediante el AudioManager pre-cargado
export const playCamcorderSound = (type) => {
  const map = {
    nightvision_on: 'nightvision_on',
    nightvision_off: 'nightvision_off',
    reload_battery: 'battery_reload',
    low_battery_beep: 'low_battery',
  };
  const key = map[type];
  if (key) {
    playSound(key, 0.85);
  }
};

export default function OutlastCamcorderOverlay({
  isDocumentOrTerminalOpen = false,
  isActive = false,
  onToggleActive,
  zoom = 1.0,
  onZoomChange,
}) {
  const [batteryLevel, setBatteryLevel] = useState(85); // 0 - 100
  const [batteryCount, setBatteryCount] = useState(3);
  const [recBlink, setRecBlink] = useState(true);
  const [timecode, setTimecode] = useState({ hours: 0, minutes: 44, seconds: 6, frames: 69 });
  const [audioFeedback, setAudioFeedback] = useState(true);

  // Reproducir sonido al activar / desactivar la videocámara (latencia cero con audio precargado)
  const prevActiveRef = useRef(isActive);
  useEffect(() => {
    if (prevActiveRef.current !== isActive) {
      if (audioFeedback) {
        playCamcorderSound(isActive ? 'nightvision_on' : 'nightvision_off');
      }
      prevActiveRef.current = isActive;
    }
  }, [isActive, audioFeedback]);

  // Parpadeo de REC y contador de timecode analógico (30 fps)
  useEffect(() => {
    const recInterval = setInterval(() => {
      setRecBlink((prev) => !prev);
    }, 750);

    const frameInterval = setInterval(() => {
      setTimecode((prev) => {
        let f = prev.frames + 1;
        let s = prev.seconds;
        let m = prev.minutes;
        let h = prev.hours;
        if (f >= 100) {
          f = 0;
          s += 1;
        }
        if (s >= 60) {
          s = 0;
          m += 1;
        }
        if (m >= 60) {
          m = 0;
          h += 1;
        }
        return { hours: h, minutes: m, seconds: s, frames: f };
      });
    }, 1000 / 30);

    return () => {
      clearInterval(recInterval);
      clearInterval(frameInterval);
    };
  }, []);

  // Consumo de batería cuando la visión nocturna (IR) está activa
  useEffect(() => {
    if (!isActive) return;

    const drainTimer = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev <= 1) {
          if (onToggleActive) onToggleActive(false);
          return 0;
        }
        return Math.max(0, prev - 0.2);
      });
    }, 1000);

    return () => clearInterval(drainTimer);
  }, [isActive, onToggleActive]);

  // Alerta sonora periódica si la batería está crítica
  useEffect(() => {
    if (isActive && batteryLevel > 0 && batteryLevel <= 18) {
      const beepInterval = setInterval(() => {
        if (audioFeedback) playCamcorderSound('low_battery_beep');
      }, 3500);
      return () => clearInterval(beepInterval);
    }
  }, [isActive, batteryLevel, audioFeedback]);

  // Recargar batería
  const reloadBattery = () => {
    if (batteryCount <= 0) return;
    setBatteryCount((c) => Math.max(0, c - 1));
    setBatteryLevel(100);
    if (audioFeedback) playCamcorderSound('reload_battery');
  };

  // Atajos de teclado: [F]/[ESC] salir, [R] recargar, [Z]/[X] o [+]/[-] zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'f' || e.key === 'F' || e.key === 'Escape') {
        if (isActive && onToggleActive) onToggleActive(false);
      } else if (e.key === 'r' || e.key === 'R') {
        if (isActive) reloadBattery();
      } else if (e.key === '+' || e.key === '=' || e.key === 'z' || e.key === 'Z') {
        if (isActive && onZoomChange) onZoomChange(Math.min(2.8, zoom + 0.2));
      } else if (e.key === '-' || e.key === '_' || e.key === 'x' || e.key === 'X') {
        if (isActive && onZoomChange) onZoomChange(Math.max(1.0, zoom - 0.2));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onToggleActive, zoom, onZoomChange, batteryCount]);

  const overlayVisibilityClass = isActive
    ? isDocumentOrTerminalOpen
      ? 'opacity-20 pointer-events-none'
      : 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none';
  const segmentsFilled = Math.ceil((batteryLevel / 100) * 4);

  return (
    <div className={`fixed inset-0 z-40 select-none transition-opacity duration-200 ${overlayVisibilityClass}`}>
      {/* =========================================================================
          LENTE DE VISIÓN NOCTURNA OUTLAST:
          Tubo óptico auténtico, viñeteado cinematográfico y grano analógico
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 1. Máscara de tubo de lente ovalada de Outlast con viñeteado periférico */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse 76% 68% at 50% 50%,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0) 52%,
                rgba(0, 15, 6, 0.40) 74%,
                rgba(0, 7, 3, 0.82) 88%,
                rgba(0, 0, 0, 0.96) 100%
              )
            `,
          }}
        />

        {/* 2. Color Grading de Fósforo P43 / IR con contraste tétrico auténtico */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: 'contrast(1.24) brightness(1.05) saturate(0.60) hue-rotate(58deg)',
            WebkitBackdropFilter: 'contrast(1.24) brightness(1.05) saturate(0.60) hue-rotate(58deg)',
          }}
        />

        {/* 3. Tinte verde fosforescente militar analógico */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(16, 56, 30, 0.18)',
            mixBlendMode: 'color-dodge',
          }}
        />

        {/* 4. Ruido/Estática de sensor analógico fino de alta frecuencia */}
        <div
          className="absolute inset-0 mix-blend-overlay outlast-grain-animation pointer-events-none"
          style={{
            opacity: 0.18,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '160px 160px',
          }}
        />

        {/* 5. Scanlines analógicas tenues de sensor de videocámara */}
        <div
          className="absolute inset-0 opacity-18 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 1px, transparent 1px, transparent 3px)',
            backgroundSize: '100% 3px',
          }}
        />
      </div>

      {/* =========================================================================
          HUD AUTÉNTICO DE OUTLAST (PIXEL-PERFECT CON LA CAPTURA DEL JUEGO)
          ========================================================================= */}
      <div className="absolute inset-0 p-6 sm:p-9 flex flex-col justify-between font-mono">
        {/* ----- BARRA SUPERIOR ----- */}
        <div className="flex justify-between items-start">
          {/* SUPERIOR IZQUIERDA: ● REC  00:44:06:69 (Todo en rojo brillante y en la misma línea) */}
          <div className="flex items-center gap-3 drop-shadow-[0_0_8px_rgba(229,9,20,0.6)]">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3 h-3 rounded-full bg-[#e50914] ${recBlink ? 'opacity-100' : 'opacity-30'
                  } transition-opacity duration-150`}
              />
              <span className="font-bold text-[#e50914] text-sm sm:text-base tracking-wider font-mono">
                REC
              </span>
            </div>
            <span className="font-mono text-[#e50914] text-sm sm:text-base tracking-widest font-semibold">
              {String(timecode.hours).padStart(2, '0')}:
              {String(timecode.minutes).padStart(2, '0')}:
              {String(timecode.seconds).padStart(2, '0')}:
              {String(timecode.frames).padStart(2, '0')}
            </span>
          </div>

          {/* SUPERIOR CENTRO: Corredera de Zoom analógica W [───██───] T */}
          <div className="flex items-center gap-2 select-none pointer-events-auto">
            <button
              onClick={() => onZoomChange && onZoomChange(Math.max(1.0, zoom - 0.2))}
              className="text-neutral-300 hover:text-white font-mono text-xs font-semibold cursor-pointer"
              title="Zoom Out (W)"
            >
              W
            </button>
            <div
              className="w-28 sm:w-36 h-2 bg-neutral-900/90 border border-neutral-600/80 rounded-[1px] relative cursor-pointer"
              title="Desplaza o usa la rueda del ratón para Zoom"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                if (onZoomChange) onZoomChange(1.0 + pct * 1.8);
              }}
            >
              {/* Deslizador blanco que se mueve con el nivel de zoom actual */}
              <div
                className="absolute top-[-2px] w-2.5 h-3 bg-white border border-neutral-400 shadow-sm transition-all duration-75"
                style={{
                  left: `calc(${((zoom - 1.0) / 1.8) * 100}% - 5px)`,
                }}
              />
            </div>
            <button
              onClick={() => onZoomChange && onZoomChange(Math.min(2.8, zoom + 0.2))}
              className="text-neutral-300 hover:text-white font-mono text-xs font-semibold cursor-pointer"
              title="Zoom In (T)"
            >
              T
            </button>
          </div>

          {/* SUPERIOR DERECHA: 3/10 + Batería horizontal + Iconos de Outlast */}
          <div className="flex flex-col items-end gap-1 select-none pointer-events-auto">
            <div className="flex items-center gap-2.5">
              {/* Contador de baterías 3/10 */}
              <span className="font-mono text-xs sm:text-sm text-neutral-200 tracking-wider font-semibold">
                {batteryCount}/10
              </span>

              {/* Icono de batería horizontal exacto a Outlast */}
              <div
                onClick={reloadBattery}
                className="relative w-11 sm:w-12 h-4 sm:h-4.5 border border-white/90 rounded-[1px] p-[1.5px] flex gap-[1.5px] bg-black/60 cursor-pointer"
                title="Haz clic o pulsa [R] para cambiar pila"
              >
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    className={`flex-1 h-full rounded-[0.5px] transition-all duration-300 ${seg <= segmentsFilled
                      ? batteryLevel <= 20
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-white'
                      : 'bg-transparent'
                      }`}
                  />
                ))}
                {/* Borne positivo derecho */}
                <div className="absolute -right-[3px] top-[3px] w-[2px] h-[8px] sm:h-[9px] bg-white/90 rounded-r-[0.5px]" />
              </div>
            </div>

            {/* Icono de sensor de visión nocturna y audio bajo la batería */}
            <div className="flex items-center gap-1.5 text-neutral-300/80 text-[10px]">
              <div className="border border-white/60 px-1 py-[0.5px] rounded-[1px] flex items-center justify-center">
                <svg className="w-3.5 h-2 text-white" viewBox="0 0 24 16" fill="currentColor">
                  <path d="M12 0C6 0 1.5 5.5 0 8c1.5 2.5 6 8 12 8s10.5-5.5 12-8c-1.5-2.5-6-8-12-8zm0 13c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                </svg>
              </div>
              <div className="border border-white/60 px-1 py-[0.5px] rounded-[1px] flex items-center gap-[2px]">
                <span className="w-[2px] h-[5px] bg-white inline-block" />
                <span className="w-[2px] h-[7px] bg-white inline-block" />
                <span className="w-[2px] h-[4px] bg-white inline-block" />
              </div>
            </div>
          </div>
        </div>

        {/* ----- RETÍCULA DE ENFOQUE CENTRAL (Fina y semi-transparente como en Outlast) ----- */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-64 h-48 sm:w-80 sm:h-60 md:w-96 md:h-72">
            {/* Esquinas muy finas translúcidas de Outlast */}
            <div className="absolute top-0 left-0 w-7 h-7 border-t border-l border-white/35" />
            <div className="absolute top-0 right-0 w-7 h-7 border-t border-r border-white/35" />
            <div className="absolute bottom-0 left-0 w-7 h-7 border-b border-l border-white/35" />
            <div className="absolute bottom-0 right-0 w-7 h-7 border-b border-r border-white/35" />

            {/* Cruz central diminuta */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2.5 h-[1px] bg-white/35" />
              <div className="h-2.5 w-[1px] absolute bg-white/35" />
            </div>
          </div>
        </div>

        {/* ----- BARRA INFERIOR ----- */}
        <div className="flex justify-between items-end">
          {/* INFERIOR IZQUIERDA: [HD] [AUTO] y F2.4 */}
          <div className="flex flex-col gap-1 select-none">
            <div className="flex items-center gap-1.5">
              <div className="border border-white/80 rounded-[2px] px-1.5 py-[0.5px] text-[10px] font-bold text-white tracking-wider">
                HD
              </div>
              <div className="border border-white/80 rounded-[2px] px-1.5 py-[0.5px] text-[10px] font-bold text-white tracking-wider">
                AUTO
              </div>
            </div>
            <div className="text-white/80 font-mono text-xs font-semibold tracking-wider">
              F2.4
            </div>
          </div>

          {/* INFERIOR DERECHA: Pistas de atajos sutiles y botón salir minimalista */}
          <div className="flex items-center gap-3 text-[10px] text-neutral-400/80 font-mono select-none pointer-events-auto">
            <span>[Rueda/Z/X] Zoom</span>
            <span>•</span>
            <span>[R] Pila</span>
            <span>•</span>
            <button
              onClick={() => onToggleActive && onToggleActive(false)}
              className="text-neutral-300 hover:text-white underline cursor-pointer"
            >
              [ESC / F] Bajar cámara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
