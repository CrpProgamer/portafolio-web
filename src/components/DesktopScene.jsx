import { useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Plane, Text, useCursor } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import InvestigationFiles from './InvestigationFiles.jsx';

// ---- 3D Models & Room ----
const Room = () => (
  <group>
    {/* Floor */}
    <Plane args={[30, 30]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
      <meshStandardMaterial color="#0a0a0a" roughness={1} />
    </Plane>
    {/* Wall Front */}
    <Plane args={[30, 15]} position={[0, 0, -5]} receiveShadow>
      <meshStandardMaterial color="#050505" roughness={0.9} />
    </Plane>
    {/* Wall Back */}
    <Plane args={[30, 15]} rotation={[0, Math.PI, 0]} position={[0, 0, 8]} receiveShadow>
      <meshStandardMaterial color="#000" roughness={1} />
    </Plane>
    {/* Wall Left */}
    <Plane args={[30, 15]} rotation={[0, Math.PI / 2, 0]} position={[-10, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#050505" roughness={0.9} />
    </Plane>
    {/* Wall Right */}
    <Plane args={[30, 15]} rotation={[0, -Math.PI / 2, 0]} position={[10, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#050505" roughness={0.9} />
    </Plane>
  </group>
);

const Desk = () => (
  <Box args={[14, 0.4, 6]} position={[0, -0.2, 0]} receiveShadow castShadow>
    <meshStandardMaterial color="#2d1c10" roughness={0.8} metalness={0.1} />
  </Box>
);

const Monitor = ({ onClick, isZooming }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && !isZooming);
  return (
    <group position={[-2, 1.5, -1]} rotation={[0, 0.2, 0]} onClick={!isZooming ? onClick : null} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Stand Base */}
      <Box args={[1.5, 0.1, 1]} position={[0, -1.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </Box>
      {/* Stand Neck */}
      <Box args={[0.4, 1.5, 0.4]} position={[0, -0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#111" roughness={0.8} />
      </Box>
      {/* Screen body */}
      <Box args={[3.4, 2.2, 0.3]} castShadow receiveShadow>
        <meshStandardMaterial color="#050505" roughness={0.5} metalness={0.8} />
      </Box>
      {/* Screen glowing */}
      <Plane args={[3.2, 2]} position={[0, 0, 0.16]}>
        <meshBasicMaterial color={hovered ? "#3dff84" : "#0f2e1a"} />
      </Plane>
      {/* Screen light cast onto desk */}
      <pointLight position={[0, 0, 1]} intensity={hovered ? 3 : 1} distance={8} color="#2ecc71" />
      <Text position={[0, 0, 0.17]} fontSize={0.25} color="#000" font="https://fonts.gstatic.com/s/courierprime/v9/u-450q2lj-cWvPBxoqsOg8s-TjU.woff">
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
      {/* Sombra de contacto */}
      <Plane args={[1.6, 2.1]} position={[0, 0, -0.01]}>
        <meshBasicMaterial color="#000" opacity={0.5} transparent />
      </Plane>
      
      <Plane args={[1.2, 1.6]} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2d426b" roughness={0.7} />
      </Plane>
      <Plane args={[1.1, 1.5]} position={[0.05, 0, 0.01]} receiveShadow>
        <meshStandardMaterial color="#d4cbb3" roughness={1} />
      </Plane>
      <Plane args={[1.1, 1.6]} position={[-0.05, 0, 0.02]} receiveShadow castShadow>
        <meshStandardMaterial color="#3b5998" roughness={0.8} />
      </Plane>
      <Text position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 2]} fontSize={0.15} color="#600000" font="https://fonts.gstatic.com/s/courierprime/v9/u-450q2lj-cWvPBxoqsOg8s-TjU.woff">
        CONFIDENCIAL
      </Text>
      {hovered && !isZooming && (
        <Text position={[0, -1.2, 0.2]} rotation={[Math.PI / 2, 0.1, 0]} fontSize={0.15} color="#fff">
          [Clic] Leer Expediente
        </Text>
      )}
    </group>
  );
};

const Clutter = () => (
  <group>
    {/* Keyboard */}
    <Box args={[2.5, 0.1, 0.8]} position={[-1.5, 0.05, 1]} rotation={[0, 0.15, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#050505" roughness={0.6} metalness={0.8} />
    </Box>
    {/* Phone */}
    <Box args={[0.8, 0.2, 1.2]} position={[-4, 0.1, 0.5]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#111" roughness={0.5} metalness={0.5} />
    </Box>
    {/* Stack of folders */}
    <Box args={[1.5, 1.2, 2]} position={[3.5, 0.6, -0.5]} rotation={[0, -0.2, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </Box>
    <Box args={[1.6, 0.1, 2.1]} position={[3.5, 1.25, -0.5]} rotation={[0, -0.2, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#2d426b" roughness={0.8} />
    </Box>
  </group>
);

// ---- Camera Controller (Breathing, Mouse Look & Cinematic Zoom) ----
const CameraController = ({ target, onReachedTarget }) => {
  const { camera, clock } = useThree();
  const basePos = new THREE.Vector3(0, 3.5, 4);
  
  useFrame((state) => {
    const time = clock.getElapsedTime();
    const breathing = Math.sin(time * 1.5) * 0.05; // Efecto respiración

    if (target === 'none') {
      const targetX = (state.pointer.x * Math.PI) / 5;
      const targetY = (state.pointer.y * Math.PI) / 8 - 0.2; 
      
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -targetX, 0.05);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetY, 0.05);
      
      // Aplicar respiración a la posición
      const targetPos = basePos.clone();
      targetPos.y += breathing;
      camera.position.lerp(targetPos, 0.05);
    } 
    else if (target === 'document') {
      const docPos = new THREE.Vector3(1.5, 1.8, 1.2);
      camera.position.lerp(docPos, 0.08);
      
      const lookTarget = new THREE.Vector3(1.5, 0, 0.5);
      const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
      currentLookAt.lerp(lookTarget, 0.1);
      camera.lookAt(currentLookAt);

      if (camera.position.distanceTo(docPos) < 0.1) onReachedTarget('document');
    }
    else if (target === 'terminal') {
      const monPos = new THREE.Vector3(-1.8, 1.5, 0.8);
      camera.position.lerp(monPos, 0.08);
      
      const lookTarget = new THREE.Vector3(-2, 1.5, -1);
      const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
      currentLookAt.lerp(lookTarget, 0.1);
      camera.lookAt(currentLookAt);

      if (camera.position.distanceTo(monPos) < 0.1) onReachedTarget('terminal');
    }
  });
  
  return null;
};


// ---- 2D Overlays ----
const DocumentOverlay = ({ onClose }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-700">
    <div className="relative w-full max-w-2xl bg-[#d4cbb3] text-[#1a1a1a] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-y-auto max-h-[90vh] font-typewriter rounded-sm border-l-8 border-[#3b5998]" 
         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
      
      <div className="absolute top-4 right-4 border-4 border-[#600000] text-[#600000] px-3 py-1 font-bold text-2xl rotate-[12deg] opacity-80 mix-blend-multiply">
        CLASIFICADO
      </div>

      <div className="border-b-2 border-black/30 pb-4 mb-6">
        <p className="mb-1 text-sm text-black/60">FECHA: 17 de septiembre de 2013</p>
        <p className="mb-1"><strong>De:</strong> 10260110756@mutemail.com</p>
        <p className="mb-1"><strong>Para:</strong> División de Análisis de Datos</p>
        <p><strong>Asunto:</strong> CONSEJO / Actividad ilegal en Sistemas Psiquiátricos Murkoff</p>
      </div>
      
      <p className="mb-4">Sé que no me conoce, pero debo hacer esto rápido. Podrían estar vigilándome.</p>
      
      <p className="mb-4">Trabajé durante dos semanas en las instalaciones de Sistemas psiquiátricos Murkoff, en el monte Massive, como consultor de software. Me temo que estoy quebrantando un montón de acuerdos de confidencialidad, pero que les jodan.</p>

      <p className="mb-4">El sujeto <span className="font-bold underline text-black">Cristobal A. Rojas Perez</span> ha trabajado intensamente en el <span className="font-bold">Caso Colchagua</span>. Demuestra capacidades anómalas para procesar terabytes de información y encontrar correlaciones donde los analistas normales solo ven ruido.</p>

      <p className="mb-4">Están ocurriendo cosas terribles. No lo entiendo. Soy incapaz de creer la mitad de las cosas que vi. Murkoff está ganando dinero a costa de hacer daño a muchas personas, y si el sujeto Rojas desencripta los notebooks y accede al Datamart, encontrará las vulnerabilidades reales de las PYMEs.</p>

      <p className="mb-8 mt-8 font-bold text-lg">La verdad tiene que salir a la luz.</p>

      <div className="flex justify-center mt-12">
        <button onClick={onClose} className="px-8 py-2 bg-[#1a1a1a] text-[#d4cbb3] border-2 border-[#1a1a1a] rounded-sm font-bold uppercase hover:bg-[#600000] hover:border-[#600000] transition-all cursor-pointer">
          Cerrar Documento
        </button>
      </div>
    </div>
  </div>
);

const TerminalOverlay = ({ onClose }) => (
  <div className="absolute inset-0 z-50 bg-[#020202] text-murkoff-paper flex flex-col p-4 animate-in fade-in zoom-in-95 duration-500">
    <div className="crt-overlay opacity-50"></div>
    <div className="flex justify-between items-center border-b-2 border-[#0a4a22] pb-2 mb-4 bg-black p-4">
      <h2 className="text-2xl font-bold text-[#3dff84] tracking-widest font-mono filter drop-shadow-[0_0_8px_rgba(61,255,132,0.8)]">SISTEMA TERMINAL v3.1 // MURKOFF CORP</h2>
      <button onClick={onClose} className="text-[#8a0303] font-bold hover:text-white border border-[#8a0303] px-4 py-1">APAGAR SISTEMA</button>
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden cursor-crosshair">
      <div className="w-full h-full">
        <Canvas shadows camera={{ position: [0, 3.5, 4], fov: 60 }}>
          <color attach="background" args={['#010101']} />
          <fog attach="fog" args={['#010101', 3, 12]} />
          
          <ambientLight intensity={0.5} />
          
          {/* Lámpara de techo intensa apuntando al escritorio */}
          <spotLight 
            position={[0, 5, 0]} 
            angle={0.8} 
            penumbra={0.5} 
            intensity={5000} 
            color="#fff4e0" 
            castShadow 
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
            decay={2}
            distance={20}
          />

          <Room />
          <Desk />
          <Monitor onClick={() => handleOpen('terminal')} isZooming={animatingTo !== 'none'} />
          <DocumentFolder onClick={() => handleOpen('document')} isZooming={animatingTo !== 'none'} />
          <Clutter />
          
          <CameraController 
            target={animatingTo} 
            onReachedTarget={(target) => {
              if (activeOverlay !== target) setActiveOverlay(target);
            }} 
          />

          {/* Post-Processing Pipeline (El efecto Outlast) */}
          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.5} 
              luminanceSmoothing={0.9} 
              intensity={1.5} 
              kernelSize={3}
            />
            <Noise opacity={0.3} blendFunction={BlendFunction.OVERLAY} />
            <Vignette eskil={false} offset={0.3} darkness={0.8} />
            <ChromaticAberration offset={[0.002, 0.002]} />
          </EffectComposer>
        </Canvas>
      </div>

      {animatingTo === 'none' && (
        <div className="absolute bottom-12 left-0 w-full text-center pointer-events-none fade-in">
          <p className="text-white/40 font-mono text-sm tracking-widest bg-black/60 inline-block px-6 py-2 border border-white/10 rounded-sm">
            O B S E R V A &nbsp;&nbsp;|&nbsp;&nbsp; I N T E R A C T U A
          </p>
        </div>
      )}

      {/* Overlays */}
      {activeOverlay === 'document' && <DocumentOverlay onClose={handleClose} />}
      {activeOverlay === 'terminal' && <TerminalOverlay onClose={handleClose} />}
    </div>
  );
}
