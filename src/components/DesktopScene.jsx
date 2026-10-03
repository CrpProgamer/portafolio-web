import { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Plane, Text, useCursor, RoundedBox } from '@react-three/drei';
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

const makeTexture = (kind) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (kind === 'wood') {
    ctx.fillStyle = '#5a351b';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 780; i += 1) {
      const y = Math.random() * 512;
      const shade = Math.floor(30 + Math.random() * 55);
      ctx.strokeStyle = `rgba(${shade + 45}, ${shade}, ${Math.max(8, shade - 20)}, ${0.08 + Math.random() * 0.2})`;
      ctx.lineWidth = 0.35 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(-20, y);
      ctx.bezierCurveTo(120, y - 8 + Math.random() * 16, 330, y + (Math.random() - 0.5) * 22, 532, y + (Math.random() - 0.5) * 11);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(25, 10, 3, 0.22)';
    for (let i = 0; i < 24; i += 1) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 512, 4 + Math.random() * 18, 1 + Math.random() * 4, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = '#b9ad8f';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 4500; i += 1) {
      const alpha = 0.025 + Math.random() * 0.08;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(70, 50, 30, ${alpha})` : `rgba(255, 245, 210, ${alpha})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    for (let i = 0; i < 38; i += 1) {
      ctx.strokeStyle = `rgba(71, 51, 28, ${0.025 + Math.random() * 0.04})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * 512);
      ctx.lineTo(512, Math.random() * 512);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(kind === 'wood' ? 2.4 : 1.5, kind === 'wood' ? 1 : 1.5);
  return texture;
};

const Desk = () => {
  const woodTexture = useMemo(() => makeTexture('wood'), []);
  useEffect(() => () => woodTexture.dispose(), [woodTexture]);

  return (
    <group>
      {/* Tabla de madera pesada, con canto y patas visibles en la penumbra */}
      <RoundedBox args={[14, 0.48, 6]} radius={0.07} smoothness={3} position={[0, -0.2, 0]} receiveShadow castShadow>
        <meshStandardMaterial map={woodTexture} color="#8b5730" roughness={0.72} metalness={0.02} />
      </RoundedBox>
      <Box args={[14.08, 0.2, 0.22]} position={[0, -0.47, 2.92]} castShadow receiveShadow>
        <meshStandardMaterial color="#3a1f0f" roughness={0.9} />
      </Box>
      {[
        [-6.15, -2.1, 2.35], [6.15, -2.1, 2.35],
        [-6.15, -2.1, -2.35], [6.15, -2.1, -2.35]
      ].map((position, index) => (
        <Box key={index} args={[0.38, 3.5, 0.38]} position={position} castShadow>
          <meshStandardMaterial color="#291507" roughness={0.88} />
        </Box>
      ))}
    </group>
  );
};

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
      <Text position={[0, 0, 0.17]} fontSize={0.25} color="#000">
        {hovered ? "> ACCEDER" : "SYS.ONLINE"}
      </Text>
    </group>
  );
};

const DocumentFolder = ({ onClick, isZooming }) => {
  const [hovered, setHovered] = useState(false);
  const coverMaterial = useRef();
  const paperTexture = useMemo(() => makeTexture('paper'), []);
  useCursor(hovered && !isZooming);
  useEffect(() => () => paperTexture.dispose(), [paperTexture]);

  useFrame(({ clock }) => {
    if (!coverMaterial.current) return;
    const time = clock.getElapsedTime();
    // Pulso muy lento, como una carpeta apenas alcanzada por una lámpara inestable.
    const slowPulse = 0.035 + (Math.sin(time * 1.35) + 1) * 0.018;
    const briefFlutter = Math.sin(time * 13.7) > 0.985 ? 0.08 : 0;
    coverMaterial.current.emissiveIntensity = slowPulse + briefFlutter + (hovered ? 0.08 : 0);
  });

  return (
    <group position={[1.5, 0.02, 0.5]} rotation={[-Math.PI / 2, 0, -0.1]} onClick={!isZooming ? onClick : null} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Sombra de contacto */}
      <Plane args={[1.6, 2.1]} position={[0, 0, -0.01]}>
        <meshBasicMaterial color="#000" opacity={0.5} transparent />
      </Plane>
      {/* Cantos de hojas irregulares y cubierta azul de expediente */}
      <Box args={[1.32, 1.76, 0.08]} position={[0, 0, 0.035]} castShadow receiveShadow>
        <meshStandardMaterial color="#21355b" roughness={0.84} />
      </Box>
      <Plane args={[1.21, 1.64]} position={[-0.03, 0, 0.086]} receiveShadow>
        <meshStandardMaterial ref={coverMaterial} color="#3d5da2" emissive="#24447d" roughness={0.76} />
      </Plane>
      <Plane args={[1.14, 1.52]} position={[0.08, 0.03, 0.092]} receiveShadow>
        <meshStandardMaterial map={paperTexture} color="#c7b99b" roughness={0.98} />
      </Plane>
      <Plane args={[1.2, 1.63]} position={[-0.08, 0, 0.101]} receiveShadow castShadow>
        <meshStandardMaterial ref={coverMaterial} color="#476ebc" emissive="#1f3f83" roughness={0.75} />
      </Plane>
      <Box args={[0.6, 0.14, 0.014]} position={[0, 0, 0.112]}>
        <meshStandardMaterial color="#b8a57d" roughness={0.7} metalness={0.15} />
      </Box>
      <Text position={[0, 0, 0.121]} rotation={[0, 0, Math.PI / 2]} fontSize={0.105} color="#180d0b">
        ARCHIVO RESTRINGIDO
      </Text>
      {hovered && !isZooming && (
        <Text position={[0, -1.2, 0.2]} rotation={[Math.PI / 2, 0.1, 0]} fontSize={0.15} color="#fff">
          [Clic] Leer Expediente
        </Text>
      )}
    </group>
  );
};

const UnstableDeskLight = () => {
  const light = useRef();
  const nextFailure = useRef(4);
  const failureEnds = useRef(0);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (time > nextFailure.current) {
      failureEnds.current = time + 0.08 + Math.random() * 0.22;
      nextFailure.current = time + 4 + Math.random() * 9;
    }
    const failing = time < failureEnds.current;
    const flutter = failing ? (Math.sin(time * 95) > 0.12 ? 0.16 : 0.55) : 1;
    const naturalVariation = 0.95 + Math.sin(time * 1.8) * 0.025;
    if (light.current) {
      light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, 1050 * flutter * naturalVariation, 0.16);
    }
  });

  return (
    <group>
      <spotLight
        ref={light}
        position={[0.6, 5, 1.4]}
        angle={0.72}
        penumbra={0.72}
        intensity={1050}
        color="#ffd59a"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        decay={2}
        distance={16}
      />
      <pointLight position={[0.6, 4.72, 1.4]} intensity={8} distance={3} color="#ffbd68" />
      <mesh position={[0.6, 4.7, 1.4]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#ffe2ad" />
      </mesh>
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
    <div className="classified-paper relative w-full max-w-2xl text-[#1a1a1a] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-y-auto max-h-[90vh] font-typewriter rounded-sm border-l-8 border-[#3b5998]">
      
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
          
          <ambientLight intensity={0.16} color="#8ba0c2" />
          <hemisphereLight args={['#526279', '#160b08', 0.34]} />
          <UnstableDeskLight />
          {/* Rebote frío mínimo para conservar lectura en las zonas oscuras */}
          <pointLight position={[-5, 1.5, -1]} intensity={13} distance={7} color="#38506d" />

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
