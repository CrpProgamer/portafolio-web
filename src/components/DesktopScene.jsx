import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Plane, Text, useCursor, Environment } from '@react-three/drei';
import InvestigationFiles from './InvestigationFiles.jsx';

// ---- 3D Models ----
const Desk = () => (
  <Box args={[12, 0.5, 6]} position={[0, -0.25, 0]} receiveShadow>
    <meshStandardMaterial color="#1a120b" roughness={0.9} />
  </Box>
);

const Monitor = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <group position={[-2, 1.5, -1]} rotation={[0, 0.2, 0]} onClick={onClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Stand */}
      <Box args={[0.4, 1.5, 0.4]} position={[0, -0.75, 0]} castShadow>
        <meshStandardMaterial color="#111" roughness={0.8} />
      </Box>
      <Box args={[1.5, 0.1, 1]} position={[0, -1.45, 0]} castShadow>
        <meshStandardMaterial color="#111" roughness={0.8} />
      </Box>
      {/* Screen body */}
      <Box args={[3.2, 2, 0.2]} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
      </Box>
      {/* Screen glowing */}
      <Plane args={[3, 1.8]} position={[0, 0, 0.11]}>
        <meshBasicMaterial color={hovered ? "#2ecc71" : "#0f2e1a"} />
      </Plane>
      <Text position={[0, 0, 0.12]} fontSize={0.2} color="#000">
        {hovered ? "> ACCEDER_TERMINAL" : "SYS.ONLINE"}
      </Text>
    </group>
  );
};

const DocumentFolder = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <group position={[1.5, 0.01, 0.5]} rotation={[-Math.PI / 2, 0, -0.2]} onClick={onClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Plane args={[1.5, 2]} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3b5998" roughness={0.7} />
      </Plane>
      <Plane args={[1.4, 1.9]} position={[0.05, 0, 0.01]}>
        <meshStandardMaterial color="#e2dcca" roughness={1} />
      </Plane>
      <Plane args={[1.4, 2]} position={[-0.05, 0, 0.02]}>
        <meshStandardMaterial color="#4a69a8" roughness={0.8} />
      </Plane>
      <Text position={[0, 0.1, 0.03]} rotation={[0, 0, Math.PI / 2]} fontSize={0.15} color="#8a0303" outlineColor="#500000" outlineWidth={0.01}>
        CONFIDENCIAL
      </Text>
      {hovered && (
        <Text position={[0, -1.5, 0.2]} rotation={[Math.PI / 2, 0.2, 0]} fontSize={0.12} color="#fff">
          Clic para leer Expediente
        </Text>
      )}
    </group>
  );
};

const Keyboard = () => (
  <Box args={[2.5, 0.1, 0.8]} position={[-1.5, 0.05, 1]} rotation={[0, 0.2, 0]} castShadow>
    <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
  </Box>
);


// ---- 2D Overlays ----
const DocumentOverlay = ({ onClose }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div className="relative w-full max-w-2xl bg-[#e2dcca] text-[#1a1a1a] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-y-auto max-h-[90vh] font-typewriter" 
         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
      
      <div className="absolute top-4 right-4 border-2 border-[#8a0303] text-[#8a0303] px-2 py-1 font-bold text-xl rotate-[15deg] opacity-70">
        CLASIFICADO
      </div>

      <p className="mb-2"><strong>De:</strong> Departamento de R.R.H.H - Murkoff Corporation</p>
      <p className="mb-2"><strong>Para:</strong> División de Análisis de Datos</p>
      <p className="mb-6"><strong>Asunto:</strong> EXPEDIENTE DE SUJETO / CRISTOBAL A. ROJAS PEREZ</p>
      
      <p className="mb-4">Sé que las operaciones de extracción de datos han sido... complicadas recientemente. Podrían estar vigilándonos, pero debemos integrar al sujeto Rojas al equipo.</p>
      
      <p className="mb-4">El sujeto ha trabajado intensamente en el <span className="font-bold underline">Caso Colchagua</span>. Demuestra capacidades anómalas para procesar terabytes de información y encontrar correlaciones donde los analistas normales solo ven ruido. Los doctores de Mount Massive creen que su habilidad con <span className="font-bold">Astro, React, y Power BI</span> podría ser la clave para estructurar el modelo predictivo (Machine Learning) que necesitamos para el Valle.</p>

      <p className="mb-4">Sin embargo, me temo que está descubriendo demasiado. Si accede al Datamart, encontrará las vulnerabilidades de las PYMEs. Estamos ganando dinero, sí, pero si el sujeto Rojas desencripta los notebooks, la verdad saldrá a la luz.</p>

      <p className="mb-8 mt-8">Deben mantenerlo ocupado. Que construya los pipelines ETL, que optimice el código. Pero no le den acceso nivel OMEGA.</p>

      <button onClick={onClose} className="mx-auto block px-6 py-2 bg-[#1a1a1a] text-[#e2dcca] font-bold uppercase hover:bg-[#8a0303] transition-colors">
        Cerrar Documento
      </button>
    </div>
  </div>
);

const TerminalOverlay = ({ onClose }) => (
  <div className="absolute inset-0 z-50 bg-[#050505] text-murkoff-paper flex flex-col p-4 animate-flicker">
    <div className="crt-overlay"></div>
    <div className="flex justify-between items-center border-b-2 border-murkoff-dark pb-2 mb-4">
      <h2 className="text-xl font-bold text-murkoff-glitch">SISTEMA TERMINAL v3.1 // MURKOFF CORP</h2>
      <button onClick={onClose} className="text-murkoff-blood font-bold hover:text-white">[X] DESCONECTAR</button>
    </div>
    <div className="flex-1 overflow-y-auto">
      <InvestigationFiles />
    </div>
  </div>
);


// ---- Main Scene Component ----
export default function DesktopScene() {
  const [activeView, setActiveView] = useState('none'); // 'none', 'document', 'terminal'
  
  // Esc key to close overlays
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveView('none');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden">
      {/* 3D Canvas */}
      <div className={`w-full h-full transition-opacity duration-1000 ${activeView !== 'none' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <Canvas shadows camera={{ position: [0, 4, 6], fov: 45 }}>
          <color attach="background" args={['#020202']} />
          <fog attach="fog" args={['#020202', 2, 15]} />
          
          <ambientLight intensity={0.1} />
          {/* Main monitor glow light */}
          <spotLight position={[-2, 2, -0.5]} angle={0.8} penumbra={1} intensity={5} color="#2ecc71" castShadow />
          {/* Dim room light */}
          <pointLight position={[2, 5, 2]} intensity={1} color="#e2dcca" />

          <Desk />
          <Monitor onClick={() => setActiveView('terminal')} />
          <DocumentFolder onClick={() => setActiveView('document')} />
          <Keyboard />
          
          {/* Restrict camera movement to simulate sitting at desk */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>

      {/* Crosshair instruction */}
      {activeView === 'none' && (
        <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
          <p className="text-white/50 font-mono text-sm tracking-widest bg-black/50 inline-block px-4 py-2 rounded">
            ARRASTRE PARA MIRAR. CLIC PARA INTERACTUAR.
          </p>
        </div>
      )}

      {/* Overlays */}
      {activeView === 'document' && <DocumentOverlay onClose={() => setActiveView('none')} />}
      {activeView === 'terminal' && <TerminalOverlay onClose={() => setActiveView('none')} />}
    </div>
  );
}
