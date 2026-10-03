import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Plane, Text, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import InvestigationFiles from './InvestigationFiles.jsx';

// ---- 3D Models ----
const Desk = () => (
  // Color madera para acercarse a la referencia
  <Box args={[14, 0.5, 6]} position={[0, -0.25, 0]} receiveShadow>
    <meshStandardMaterial color="#5C4033" roughness={0.8} />
  </Box>
);

const Monitor = ({ onClick, isZooming }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && !isZooming);
  return (
    <group position={[-2, 1.5, -1]} rotation={[0, 0.2, 0]} onClick={!isZooming ? onClick : null} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
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
        {hovered ? "> ACCEDER" : "SYS.ONLINE"}
      </Text>
    </group>
  );
};

const DocumentFolder = ({ onClick, isZooming }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && !isZooming);
  return (
    <group position={[1.5, 0.01, 0.5]} rotation={[-Math.PI / 2, 0, -0.1]} onClick={!isZooming ? onClick : null} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Plane args={[1.2, 1.6]} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#4A708B" roughness={0.9} />
      </Plane>
      <Plane args={[1.1, 1.5]} position={[0.05, 0, 0.01]}>
        <meshStandardMaterial color="#e2dcca" roughness={1} />
      </Plane>
      <Plane args={[1.1, 1.6]} position={[-0.05, 0, 0.02]}>
        <meshStandardMaterial color="#5C8EB5" roughness={0.9} />
      </Plane>
      <Text position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 2]} fontSize={0.15} color="#8a0303">
        CONFIDENCIAL
      </Text>
      <Text position={[0.2, 0, 0.03]} rotation={[0, 0, Math.PI / 2]} fontSize={0.08} color="#111">
        EXP. ROJAS
      </Text>
      {hovered && !isZooming && (
        <Text position={[0, -1.2, 0.2]} rotation={[Math.PI / 2, 0.1, 0]} fontSize={0.15} color="#fff">
          Pulsa (Clic) para coger Documento
        </Text>
      )}
    </group>
  );
};

const KeyboardAndPhone = () => (
  <group>
    {/* Keyboard */}
    <Box args={[2.5, 0.1, 0.8]} position={[-1.5, 0.05, 1]} rotation={[0, 0.15, 0]} castShadow>
      <meshStandardMaterial color="#111" roughness={0.7} />
    </Box>
    {/* Phone */}
    <Box args={[0.8, 0.2, 1]} position={[-4, 0.1, 0.5]} rotation={[0, 0.3, 0]} castShadow>
      <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
    </Box>
    {/* Stack of folders */}
    <Box args={[1.5, 1, 2]} position={[3.5, 0.5, -0.5]} rotation={[0, -0.2, 0]} castShadow>
      <meshStandardMaterial color="#333" roughness={0.8} />
    </Box>
  </group>
);

// ---- Camera Controller (FPS Mouse Look & Animations) ----
const CameraController = ({ target, onReachedTarget }) => {
  const { camera } = useThree();
  
  // Posición base (sentado frente al escritorio)
  const basePos = new THREE.Vector3(0, 3.5, 4);
  
  useFrame((state, delta) => {
    if (target === 'none') {
      // Movimiento libre con el ratón (efecto primera persona sin bloquear el cursor)
      const targetX = (state.pointer.x * Math.PI) / 6;
      const targetY = (state.pointer.y * Math.PI) / 12 - 0.2; // Mirar un poco hacia abajo por defecto
      
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -targetX, 0.1);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetY, 0.1);
      
      // Volver a la posición base suavemente
      camera.position.lerp(basePos, 0.05);
    } 
    else if (target === 'document') {
      // Animar cámara hacia el documento
      const docPos = new THREE.Vector3(1.5, 1.5, 1.5);
      camera.position.lerp(docPos, 0.08);
      
      // Look at document
      const lookTarget = new THREE.Vector3(1.5, 0, 0.5);
      const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
      currentLookAt.lerp(lookTarget, 0.1);
      camera.lookAt(currentLookAt);

      if (camera.position.distanceTo(docPos) < 0.2) {
        onReachedTarget('document');
      }
    }
    else if (target === 'terminal') {
      // Animar cámara hacia el monitor
      const monPos = new THREE.Vector3(-1.8, 1.5, 0.5);
      camera.position.lerp(monPos, 0.08);
      
      const lookTarget = new THREE.Vector3(-2, 1.5, -1);
      const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
      currentLookAt.lerp(lookTarget, 0.1);
      camera.lookAt(currentLookAt);

      if (camera.position.distanceTo(monPos) < 0.2) {
        onReachedTarget('terminal');
      }
    }
  });
  
  return null;
};


// ---- 2D Overlays ----
const DocumentOverlay = ({ onClose }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-500">
    <div className="relative w-full max-w-2xl bg-[#e2dcca] text-[#1a1a1a] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-y-auto max-h-[90vh] font-typewriter rounded-sm" 
         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
      
      <div className="absolute top-4 right-4 border-2 border-[#8a0303] text-[#8a0303] px-2 py-1 font-bold text-xl rotate-[15deg] opacity-70">
        CLASIFICADO
      </div>

      <p className="mb-2"><strong>De:</strong> Departamento de R.R.H.H - Murkoff Corporation</p>
      <p className="mb-2"><strong>Para:</strong> División de Análisis de Datos</p>
      <p className="mb-6"><strong>Asunto:</strong> EXPEDIENTE DE SUJETO / CRISTOBAL A. ROJAS PEREZ</p>
      
      <p className="mb-4">Sé que no me conoce, pero debo hacer esto rápido. Las operaciones de extracción de datos en Colchagua han sido... complicadas. Podrían estar vigilándonos.</p>
      
      <p className="mb-4">El sujeto Rojas ha trabajado intensamente en el <span className="font-bold underline">Caso Colchagua</span>. Demuestra capacidades anómalas para procesar terabytes de información y encontrar correlaciones donde los analistas normales solo ven ruido. Los doctores de Mount Massive creen que su habilidad con <span className="font-bold">Astro, React, y Power BI</span> podría ser la clave para estructurar el modelo predictivo (Machine Learning) que necesitamos para el Valle.</p>

      <p className="mb-4">Están ocurriendo cosas terribles. Murkoff está ganando dinero, sí, pero si el sujeto Rojas desencripta los notebooks, la verdad saldrá a la luz. Si accede al Datamart, encontrará las vulnerabilidades reales de las PYMEs.</p>

      <p className="mb-8 mt-8 font-bold">La verdad tiene que salir a la luz.</p>

      <div className="flex justify-center mt-12">
        <button onClick={onClose} className="px-8 py-2 bg-[#b3a895] text-[#1a1a1a] border-2 border-[#8c8270] rounded-full font-bold uppercase hover:bg-[#8a0303] hover:text-[#e2dcca] hover:border-[#8a0303] transition-all">
          Cerrar
        </button>
      </div>
    </div>
  </div>
);

const TerminalOverlay = ({ onClose }) => (
  <div className="absolute inset-0 z-50 bg-[#050505] text-murkoff-paper flex flex-col p-4 animate-in fade-in zoom-in-95 duration-500">
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
  const [animatingTo, setAnimatingTo] = useState('none'); 
  const [activeOverlay, setActiveOverlay] = useState('none'); 
  
  const handleOpen = (target) => {
    setAnimatingTo(target);
  };

  const handleClose = () => {
    setActiveOverlay('none');
    setAnimatingTo('none');
  };

  // Esc key to close overlays
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden">
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas shadows camera={{ position: [0, 3.5, 4], fov: 50 }}>
          <color attach="background" args={['#020202']} />
          <fog attach="fog" args={['#020202', 2, 10]} />
          
          <ambientLight intensity={0.05} />
          
          {/* Luz cenital sobre el escritorio (Overhead light) */}
          <spotLight 
            position={[0, 6, 0]} 
            angle={0.6} 
            penumbra={0.8} 
            intensity={4} 
            color="#fff0d4" 
            castShadow 
            shadow-bias={-0.0001}
          />

          {/* Main monitor glow light */}
          <spotLight position={[-2, 1.5, -0.5]} angle={0.8} penumbra={1} intensity={2} color="#2ecc71" />

          <Desk />
          <Monitor onClick={() => handleOpen('terminal')} isZooming={animatingTo !== 'none'} />
          <DocumentFolder onClick={() => handleOpen('document')} isZooming={animatingTo !== 'none'} />
          <KeyboardAndPhone />
          
          <CameraController 
            target={animatingTo} 
            onReachedTarget={(target) => {
              if (activeOverlay !== target) setActiveOverlay(target);
            }} 
          />
        </Canvas>
      </div>

      {/* Crosshair instruction */}
      {animatingTo === 'none' && (
        <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none fade-in">
          <p className="text-white/50 font-mono text-xs tracking-widest bg-black/50 inline-block px-4 py-2 rounded">
            MUEVE EL RATÓN PARA MIRAR. CLIC PARA INTERACTUAR.
          </p>
        </div>
      )}

      {/* Overlays */}
      {activeOverlay === 'document' && <DocumentOverlay onClose={handleClose} />}
      {activeOverlay === 'terminal' && <TerminalOverlay onClose={handleClose} />}
    </div>
  );
}
