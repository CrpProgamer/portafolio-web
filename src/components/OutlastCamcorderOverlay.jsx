import React, { useState, useEffect, useRef } from 'react';

// Generador de efectos de sonido sintetizados nativos (sin archivos externos para 0 latencia y 0 errores 404)
const playCamcorderSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'nightvision_on') {
      // Clic mecánico + zumbido ascendente de capacitor de visión nocturna
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'nightvision_off') {
      // Clic mecánico apagado grave
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'reload_battery') {
      // Sonido de recarga de batería (doble clic plástico)
      [0, 0.12].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(i === 0 ? 320 : 640, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.09);
      });
    } else if (type === 'low_battery_beep') {
      // Pitido de batería crítica
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1040, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    }
  } catch (err) {
    // Si el usuario no ha interactuado aún con el DOM, el navegador silencia el audio sin error
  }
};

export default function OutlastCamcorderOverlay({ isDocumentOrTerminalOpen = false }) {
  const [nightVision, setNightVision] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(78); // 0 - 100
  const [batteryCount, setBatteryCount] = useState(2);
  const [recBlink, setRecBlink] = useState(true);
  const [timecode, setTimecode] = useState({ hours: 0, minutes: 14, seconds: 22, frames: 18 });
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [zoom, setZoom] = useState(1.0);
  const [showHud, setShowHud] = useState(true);
  const [lowBatteryWarning, setLowBatteryWarning] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);

  // Parpadeo de REC y contador de timecode analógico (30 fps)
  useEffect(() => {
    const recInterval = setInterval(() => {
      setRecBlink((prev) => !prev);
    }, 850);

    const frameInterval = setInterval(() => {
      setTimecode((prev) => {
        let f = prev.frames + 1;
        let s = prev.seconds;
        let m = prev.minutes;
        let h = prev.hours;
        if (f >= 30) {
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

  // Reloj digital y fecha del sistema en formato videocámara VHS / Handycam
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const hours = pad(now.getHours());
      const mins = pad(now.getMinutes());
      const secs = pad(now.getSeconds());
      setCurrentTimeStr(`${hours}:${mins}:${secs}`);

      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      const day = pad(now.getDate());
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      setCurrentDateStr(`${day} ${month} ${year}`);
    };
    updateTime();
    const clockTimer = setInterval(updateTime, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Consumo de batería cuando la visión nocturna (IR) está activa (estilo Outlast auténtico)
  useEffect(() => {
    if (!nightVision) return;

    const drainTimer = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev <= 1) {
          // Batería agotada: apagar visión nocturna
          setNightVision(false);
          if (audioFeedback) playCamcorderSound('nightvision_off');
          return 0;
        }
        const next = Math.max(0, prev - 0.25);
        if (next < 20) {
          setLowBatteryWarning(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(drainTimer);
  }, [nightVision, audioFeedback]);

  // Alerta sonora periódica si la batería está crítica
  useEffect(() => {
    if (nightVision && batteryLevel > 0 && batteryLevel <= 18) {
      const beepInterval = setInterval(() => {
        if (audioFeedback) playCamcorderSound('low_battery_beep');
      }, 3500);
      return () => clearInterval(beepInterval);
    }
  }, [nightVision, batteryLevel, audioFeedback]);

  // Alternar Visión Nocturna
  const toggleNightVision = () => {
    if (!nightVision && batteryLevel <= 0) {
      if (batteryCount > 0) {
        reloadBattery();
        return;
      }
      return;
    }
    const nextState = !nightVision;
    setNightVision(nextState);
    if (audioFeedback) {
      playCamcorderSound(nextState ? 'nightvision_on' : 'nightvision_off');
    }
  };

  // Recargar batería
  const reloadBattery = () => {
    if (batteryCount <= 0) return;
    setBatteryCount((c) => c - 1);
    setBatteryLevel(100);
    setLowBatteryWarning(false);
    if (!nightVision) setNightVision(true);
    if (audioFeedback) playCamcorderSound('reload_battery');
  };

  // Atajos de teclado: [F] para visión nocturna, [R] para recargar batería, [H] para ocultar HUD
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'f' || e.key === 'F') {
        toggleNightVision();
      } else if (e.key === 'r' || e.key === 'R') {
        reloadBattery();
      } else if (e.key === 'h' || e.key === 'H') {
        setShowHud((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nightVision, batteryLevel, batteryCount, audioFeedback]);

  // Si hay un expediente o terminal abierto en pantalla completa, atenuar ligeramente para no estorbar
  const overlayDimClass = isDocumentOrTerminalOpen ? 'opacity-30 pointer-events-none' : 'opacity-100';

  // Cálculo de segmentos de batería (4 barras como en Outlast)
  const segmentsFilled = Math.ceil((batteryLevel / 100) * 4);

  return (
    <div className={`fixed inset-0 z-40 pointer-events-none select-none transition-opacity duration-500 ${overlayDimClass}`}>
      {/* =========================================================================
          FILTRO ÓPTICO Y COLOR GRADING DE VISIÓN NOCTURNA OUTLAST (CSS + SVG)
          ========================================================================= */}
      {nightVision && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 1. Capa de Tinte Verde Fosforescente / Infrarrojo de Alta Intensidad */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  circle at 50% 50%,
                  rgba(24, 255, 109, 0.58) 0%,
                  rgba(14, 185, 78, 0.45) 32%,
                  rgba(5, 95, 38, 0.40) 65%,
                  rgba(1, 30, 10, 0.88) 92%,
                  rgba(0, 10, 2, 0.98) 100%
                )
              `,
              mixBlendMode: 'screen',
            }}
          />

          {/* 2. Iluminador IR Central (Efecto de haz de linterna infrarroja de la videocámara) */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  circle at 50% 48%,
                  rgba(235, 255, 240, 0.32) 0%,
                  rgba(130, 255, 170, 0.22) 28%,
                  rgba(0, 0, 0, 0) 68%
                )
              `,
              mixBlendMode: 'color-dodge',
            }}
          />

          {/* 3. Viñeta profunda de lente angular (Bordes negros intensos tipo Outlast) */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: 'inset 0 0 140px 60px rgba(0, 0, 0, 0.94), inset 0 0 60px 20px rgba(0, 20, 5, 0.8)',
            }}
          />

          {/* 4. Filtro de Realce de Brillo y Contraste sobre la escena subyacente */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: 'brightness(1.55) contrast(1.35) saturate(0.2) hue-rotate(85deg)',
              WebkitBackdropFilter: 'brightness(1.55) contrast(1.35) saturate(0.2) hue-rotate(85deg)',
            }}
          />

          {/* 5. Ruido Analógico de Sensor CMOS / Estática Infrarroja (SVG Noise Pattern) */}
          <div
            className="absolute inset-0 opacity-45 mix-blend-overlay outlast-grain-animation"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />

          {/* 6. Scanlines finas de sensor de videocámara */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.35) 0px, rgba(0, 0, 0, 0.35) 1px, transparent 1px, transparent 3px)',
              backgroundSize: '100% 3px',
            }}
          />
        </div>
      )}

      {/* Si la visión nocturna está APAGADA: Viñeta cinematográfica oscura normal */}
      {!nightVision && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.75) 85%, rgba(0,0,0,0.95) 100%)',
          }}
        />
      )}

      {/* =========================================================================
          HUD INTERACTIVO DE LA VIDEOCÁMARA DE OUTLAST
          ========================================================================= */}
      {showHud && (
        <div className="absolute inset-0 p-4 sm:p-7 flex flex-col justify-between font-mono text-sm tracking-wider">
          {/* ----- BARRA SUPERIOR ----- */}
          <div className="flex justify-between items-start">
            {/* Izquierda: REC + Modo de Grabación */}
            <div className="flex flex-col gap-1 drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-2.5">
                {/* Indicador REC parpadeante */}
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-opacity duration-200 ${
                    recBlink ? 'bg-[#ff2020] shadow-[0_0_12px_#ff2020]' : 'opacity-20 bg-[#ff2020]'
                  }`}
                />
                <span className={`font-bold tracking-widest text-base ${recBlink ? 'text-white' : 'text-neutral-400'}`}>
                  REC
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-black/60 border border-neutral-700 text-neutral-300 font-sans font-semibold">
                  SP
                </span>
                <span className="text-xs text-neutral-400 hidden sm:inline">
                  FHD 60fps
                </span>
              </div>

              {/* Indicador de Modo de Visión Nocturna */}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 font-bold uppercase tracking-wider rounded border ${
                    nightVision
                      ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#22ff77] shadow-[0_0_8px_rgba(34,255,119,0.5)]'
                      : 'bg-neutral-900/80 border-neutral-700 text-neutral-400'
                  }`}
                >
                  {nightVision ? '● NV: ON [IR SENSOR]' : '○ NV: OFF [STANDARD]'}
                </span>
              </div>
            </div>

            {/* Derecha: Indicador de Batería Outlast + Pilas de Repuesto */}
            <div className="flex flex-col items-end gap-1.5 drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-3">
                {/* Pilas de reserva disponibles */}
                <div className="flex items-center gap-1 text-xs text-neutral-300 bg-black/65 px-2.5 py-1 rounded border border-neutral-700">
                  <span className="text-[10px] text-neutral-400 uppercase">Pilas:</span>
                  <span className="font-bold text-amber-300 text-sm">{batteryCount}</span>
                </div>

                {/* Icono de Batería Segmentada de Outlast */}
                <div className="flex items-center">
                  <div
                    className={`relative w-14 h-6 border-2 rounded-sm p-0.5 flex gap-0.5 bg-black/75 transition-colors ${
                      batteryLevel <= 20
                        ? 'border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.6)] animate-pulse'
                        : nightVision
                        ? 'border-[#22ff77] shadow-[0_0_8px_rgba(34,255,119,0.4)]'
                        : 'border-neutral-200'
                    }`}
                  >
                    {/* 4 barras o segmentos rectangulares de energía */}
                    {[1, 2, 3, 4].map((seg) => {
                      const isFilled = seg <= segmentsFilled;
                      let segColor = 'bg-[#22ff77]';
                      if (batteryLevel <= 20) segColor = 'bg-red-500';
                      else if (batteryLevel <= 45) segColor = 'bg-yellow-400';

                      return (
                        <div
                          key={seg}
                          className={`flex-1 h-full rounded-[1px] transition-all duration-300 ${
                            isFilled ? segColor : 'bg-transparent'
                          }`}
                        />
                      );
                    })}

                    {/* Terminal positivo de la pila */}
                    <div
                      className={`absolute -right-2 top-1.5 w-1.5 h-2.5 rounded-r-xs ${
                        batteryLevel <= 20 ? 'bg-red-500' : nightVision ? 'bg-[#22ff77]' : 'bg-neutral-200'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Porcentaje numérico y alerta si está baja */}
              <div className="flex items-center gap-2 text-xs">
                {batteryLevel <= 20 && (
                  <span className="text-red-400 font-bold animate-pulse text-[11px] tracking-normal">
                    ¡BATERÍA BAJA!
                  </span>
                )}
                <span className={batteryLevel <= 20 ? 'text-red-400 font-bold' : nightVision ? 'text-[#22ff77]' : 'text-neutral-300'}>
                  {Math.round(batteryLevel)}%
                </span>
              </div>
            </div>
          </div>

          {/* ----- RETÍCULA DE ENFOQUE CENTRAL DE LA VIDEOCÁMARA ----- */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-64 h-48 sm:w-80 sm:h-64 md:w-96 md:h-72">
              {/* Esquinas de enfoque estilo Handycam / Outlast */}
              <div
                className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 transition-colors ${
                  nightVision ? 'border-[#22ff77]/70' : 'border-white/50'
                }`}
              />
              <div
                className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 transition-colors ${
                  nightVision ? 'border-[#22ff77]/70' : 'border-white/50'
                }`}
              />
              <div
                className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 transition-colors ${
                  nightVision ? 'border-[#22ff77]/70' : 'border-white/50'
                }`}
              />
              <div
                className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 transition-colors ${
                  nightVision ? 'border-[#22ff77]/70' : 'border-white/50'
                }`}
              />

              {/* Cruz de enfoque central muy sutil */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-3 h-0.5 transition-colors ${nightVision ? 'bg-[#22ff77]/60' : 'bg-white/40'}`}
                />
                <div
                  className={`h-3 w-0.5 absolute transition-colors ${nightVision ? 'bg-[#22ff77]/60' : 'bg-white/40'}`}
                />
              </div>

              {/* Indicador de escala de Zoom analógico [W ----|---- T] */}
              <div className="absolute -bottom-7 inset-x-0 flex justify-center items-center gap-2 text-[10px] text-neutral-400">
                <span>W</span>
                <div className="w-24 h-1 bg-black/60 border border-neutral-700 relative rounded-full">
                  <div
                    className={`absolute top-0 bottom-0 w-1 rounded-full ${
                      nightVision ? 'bg-[#22ff77]' : 'bg-white'
                    }`}
                    style={{ left: `${((zoom - 1.0) / 1.4) * 100}%` }}
                  />
                </div>
                <span>T</span>
                <span className="text-[11px] font-bold text-neutral-300">{zoom.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          {/* ----- BARRA INFERIOR ----- */}
          <div className="flex justify-between items-end">
            {/* Izquierda: Fecha, Hora y Contador de cinta analógico */}
            <div className="flex flex-col gap-0.5 text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(0,0,0,0.9)] text-neutral-200">
              <div className="flex items-center gap-3 font-semibold text-xs text-neutral-300">
                <span>{currentDateStr}</span>
                <span>{currentTimeStr}</span>
              </div>
              <div className="font-mono text-base tracking-widest font-bold text-white/90">
                {String(timecode.hours).padStart(2, '0')}:
                {String(timecode.minutes).padStart(2, '0')}:
                {String(timecode.seconds).padStart(2, '0')}:
                <span className="text-xs text-neutral-400">
                  {String(timecode.frames).padStart(2, '0')}
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                MURKOFF ASYLUM ARCHIVES // CAM_01
              </div>
            </div>

            {/* Derecha: Botonera Interactiva y Atajos del Jugador */}
            <div className="flex flex-col items-end gap-2 pointer-events-auto">
              {/* Botones de acción rápida en pantalla */}
              <div className="flex items-center gap-2">
                {/* Botón Visión Nocturna */}
                <button
                  type="button"
                  onClick={toggleNightVision}
                  title="Activar/Desactivar Visión Nocturna (Tecla F)"
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded border transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5 ${
                    nightVision
                      ? 'bg-[#003816]/90 hover:bg-[#005522] border-[#22ff77] text-[#22ff77] shadow-[0_0_12px_rgba(34,255,119,0.4)]'
                      : 'bg-black/80 hover:bg-neutral-800 border-neutral-600 text-neutral-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${nightVision ? 'bg-[#22ff77] animate-ping' : 'bg-neutral-500'}`} />
                  <span>NV [F]</span>
                </button>

                {/* Botón Cambiar Batería */}
                <button
                  type="button"
                  onClick={reloadBattery}
                  disabled={batteryCount <= 0 || batteryLevel >= 99}
                  title="Recargar Batería (Tecla R)"
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded border transition-all cursor-pointer shadow-lg active:scale-95 ${
                    batteryCount > 0 && batteryLevel < 99
                      ? 'bg-amber-950/80 hover:bg-amber-900 border-amber-500 text-amber-300'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  PILA [R]
                </button>
              </div>

              {/* Pistas sutiles de atajos de teclado para inmersión */}
              <div className="text-[10px] text-neutral-400 bg-black/60 px-2 py-0.5 rounded border border-neutral-800 flex gap-2">
                <span>[F] Visión Nocturna</span>
                <span>•</span>
                <span>[R] Pila</span>
                <span>•</span>
                <button
                  onClick={() => setShowHud(false)}
                  className="hover:text-white underline cursor-pointer"
                >
                  [H] Ocultar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante para restaurar HUD si fue ocultado con [H] */}
      {!showHud && (
        <button
          onClick={() => setShowHud(true)}
          className="pointer-events-auto absolute bottom-4 right-4 text-[11px] bg-black/80 border border-neutral-700 text-neutral-300 px-3 py-1 rounded hover:bg-neutral-800 cursor-pointer"
        >
          Mostrar HUD [H]
        </button>
      )}
    </div>
  );
}
