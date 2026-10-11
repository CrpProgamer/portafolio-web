import { useState } from 'react';

export default function OutlastDocumentOverlay({ onClose }) {
  const [currentPage, setCurrentPage] = useState(1); // 1 = Documento Oficial (Img 2), 2 = Notas de Campo (Img 3)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl md:max-w-2xl my-auto transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Selector de páginas discreto en la parte superior (Documento 1/2 vs Nota 2/2) */}
        <div className="flex justify-between items-center mb-3 px-2 text-white/60 font-mono text-xs tracking-widest uppercase">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            EVIDENCIA // {currentPage === 1 ? 'EXPEDIENTE CLASIFICADO' : 'NOTAS DE CAMPO'}
          </span>
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded border border-white/10">
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentPage === 1 ? 'text-white font-bold bg-white/15' : 'text-white/40 hover:text-white'
              }`}
            >
              1. DOCUMENTO
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setCurrentPage(2)}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentPage === 2 ? 'text-white font-bold bg-white/15' : 'text-white/40 hover:text-white'
              }`}
            >
              2. NOTAS
            </button>
          </div>
        </div>

        {/* ================= PÁGINA 1: DOCUMENTO TIPO ESCRITO A MÁQUINA (REFERENCIA FOTO 2) ================= */}
        {currentPage === 1 && (
          <div
            className="relative bg-[#ebe6dc] text-[#242424] p-8 sm:p-12 md:p-14 shadow-[0_25px_70px_rgba(0,0,0,0.85)] rounded-xs font-typewriter leading-relaxed"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, rgba(210,202,188,0.3) 100%), linear-gradient(rgba(30,20,10,0.02) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 100% 4px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9), inset 0 0 40px rgba(120,95,60,0.12)',
            }}
          >
            {/* Cabecera idéntica a la referencia de Outlast */}
            <div className="space-y-1 text-sm md:text-base text-[#222222] mb-8 font-typewriter">
              <p>17 de septiembre de 2013</p>
              <p>De: 10260110756@mutemail.com</p>
              <p>Para: confidencial@analisis.cl</p>
              <p>Asunto: CONSEJO / Actividad irregular en Corporación Murkoff</p>
            </div>

            {/* Cuerpo del correo / informe */}
            <div className="space-y-6 text-sm md:text-base text-[#262626] leading-relaxed text-justify">
              <p>Sé que no me conoce, pero debo hacer esto rápido. Podrían estar vigilándome.</p>

              <p>
                Trabajé durante dos semanas en las instalaciones de Sistemas psiquiátricos Murkoff, en el monte Massive, como consultor de software. Me temo que estoy quebrantando un montón de acuerdos de confidencialidad, pero que les jodan.
              </p>

              <p>
                El analista <strong className="font-bold underline text-black">Cristobal A. Rojas Perez</strong> ha documentado minuciosamente las operaciones en el <strong className="font-bold">Caso Colchagua</strong>. Demuestra capacidades analíticas sobresalientes para modelar terabytes de datos, identificar patrones ocultos y estructurar pipelines de Business Intelligence donde otros solo perciben caos.
              </p>

              <p>
                Están ocurriendo cosas terribles. No lo entiendo. Soy incapaz de creer la mitad de las cosas que vi. Murkoff encubre vulnerabilidades organizacionales críticas y lucra a costa del daño. Si se investigan los modelos analíticos y se auditan los dashboards del Datamart, todas las irregularidades quedarán expuestas.
              </p>

              <p className="font-bold pt-2">La verdad tiene que salir a la luz.</p>
            </div>

            {/* Botón de Atrás: Cápsula ovalada translúcida gris como en la referencia */}
            <div className="flex justify-center mt-12 pt-2">
              <button
                onClick={onClose}
                className="group relative rounded-full bg-black/10 hover:bg-black/20 border border-black/20 px-10 py-1.5 text-[#222222] font-mono text-sm tracking-[0.35em] uppercase transition-all duration-200 shadow-sm backdrop-blur-xs hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                title="Cerrar documento"
              >
                <span>A t r á s</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= PÁGINA 2: HOJA DE CUADERNO RAYADA CON TINTA AZUL (REFERENCIA FOTO 3) ================= */}
        {currentPage === 2 && (
          <div
            className="relative bg-[#f4f1e8] text-[#1e3a8a] p-8 sm:p-12 md:p-14 shadow-[0_25px_70px_rgba(0,0,0,0.85)] rounded-xs font-handwriting leading-[30px]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(transparent, transparent 29px, #93c5fd 30px)',
              backgroundSize: '100% 30px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9), inset 0 0 45px rgba(130,105,70,0.15)',
            }}
          >
            <div className="text-xl sm:text-2xl text-[#1e3a8a] space-y-7 leading-[30px] pt-1">
              <p>
                Contemplar este lugar hace que me sienta enfermo. El complejo cerró sus puertas tras los escándalos y el secretismo corporativo, pero Murkoff volvió a abrirlo disfrazándolo de desarrollo y consultoría benéfica.
              </p>

              <p>
                Los dispositivos pierden la cobertura de repente a un kilómetro del centro, pero más que pérdida de señal parece cosa de inhibidores deliberados. La corporación Murkoff tiene un largo historial de rentabilidad disfrazada de caridad.
              </p>

              <p>
                No sé qué pretenden ocultar con los registros del personal, pero tiene que ser algo de enorme escala. Los análisis de Cristobal Rojas demuestran las inconsistencias en sus bases de datos. Puede que este informe sea el que por fin acabe con la impunidad de estos tipos.
              </p>
            </div>

            {/* Botón de Atrás: Cápsula idéntica */}
            <div className="flex justify-center mt-12 pt-4">
              <button
                onClick={onClose}
                className="group relative rounded-full bg-black/10 hover:bg-black/20 border border-black/20 px-10 py-1.5 text-[#222222] font-mono text-sm tracking-[0.35em] uppercase transition-all duration-200 shadow-sm backdrop-blur-xs hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                title="Cerrar notas"
              >
                <span>A t r á s</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
