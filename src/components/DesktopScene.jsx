import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Plane, Text, useCursor, RoundedBox, useGLTF, useTexture, Center } from '@react-three/drei';
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

  if (kind === 'grime') {
    ctx.clearRect(0, 0, 512, 512);
    for (let i = 0; i < 88; i += 1) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = 12 + Math.random() * 66;
      const patch = ctx.createRadialGradient(x, y, 0, x, y, radius);
      patch.addColorStop(0, `rgba(13, 8, 4, ${0.06 + Math.random() * 0.18})`);
      patch.addColorStop(0.62, `rgba(36, 21, 10, ${0.02 + Math.random() * 0.1})`);
      patch.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = patch;
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * (0.22 + Math.random() * 0.42), Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 70; i += 1) {
      ctx.strokeStyle = `rgba(9, 6, 3, ${0.12 + Math.random() * 0.22})`;
      ctx.lineWidth = 0.4 + Math.random() * 1.8;
      ctx.beginPath();
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.moveTo(x, y);
      ctx.lineTo(x + 15 + Math.random() * 72, y - 4 + Math.random() * 8);
      ctx.stroke();
    }
  } else if (kind === 'blood') {
    ctx.clearRect(0, 0, 512, 512);
    ctx.save();
    ctx.filter = 'blur(1.8px)';
    const smear = ctx.createRadialGradient(245, 250, 16, 245, 250, 180);
    smear.addColorStop(0, 'rgba(78, 4, 3, 0.94)');
    smear.addColorStop(0.48, 'rgba(69, 5, 3, 0.7)');
    smear.addColorStop(1, 'rgba(42, 3, 2, 0)');
    ctx.fillStyle = smear;
    ctx.beginPath();
    ctx.ellipse(250, 250, 170, 82, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    for (let i = 0; i < 42; i += 1) {
      const x = 90 + Math.random() * 340;
      const y = 90 + Math.random() * 320;
      const radius = 1 + Math.random() * 10;
      ctx.fillStyle = `rgba(${50 + Math.floor(Math.random() * 38)}, ${2 + Math.floor(Math.random() * 10)}, 2, ${0.28 + Math.random() * 0.55})`;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * (0.45 + Math.random()), radius, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'wood') {
    ctx.fillStyle = '#382315';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 780; i += 1) {
      const y = Math.random() * 512;
      const shade = Math.floor(18 + Math.random() * 42);
      ctx.strokeStyle = `rgba(${shade + 36}, ${shade + 13}, ${Math.max(5, shade - 5)}, ${0.12 + Math.random() * 0.28})`;
      ctx.lineWidth = 0.5 + Math.random() * 2.4;
      ctx.beginPath();
      ctx.moveTo(-20, y);
      ctx.bezierCurveTo(120, y - 8 + Math.random() * 16, 330, y + (Math.random() - 0.5) * 22, 532, y + (Math.random() - 0.5) * 11);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(9, 6, 3, 0.34)';
    for (let i = 0; i < 42; i += 1) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 512, 4 + Math.random() * 18, 1 + Math.random() * 4, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    // Polvo adherido y pequeñas marcas oscuras acumuladas en la madera.
    for (let i = 0; i < 340; i += 1) {
      ctx.fillStyle = `rgba(8, 6, 4, ${0.06 + Math.random() * 0.2})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 7, 1 + Math.random() * 3);
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

const BloodStain = ({ position, rotation = 0, size = [1.4, 0.7], opacity = 0.82 }) => {
  const bloodTexture = useMemo(() => makeTexture('blood'), []);
  useEffect(() => () => bloodTexture.dispose(), [bloodTexture]);
  return (
    <Plane args={size} rotation={[-Math.PI / 2, 0, rotation]} position={position} receiveShadow>
      <meshBasicMaterial map={bloodTexture} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} />
    </Plane>
  );
};

const BloodTextureStain = ({ file, position, rotation = 0, size, opacity = 1 }) => {
  const sourceTexture = useTexture(`/assets/textures/BlueRoseSonata%20Blood%20FX%20Pack/${file}`);
  const texture = useMemo(() => {
    const image = sourceTexture.image;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);

    // El pack viene sobre negro: se transforma ese negro en alfa, no en una mancha opaca.
    for (let index = 0; index < pixels.data.length; index += 4) {
      const red = pixels.data[index];
      const green = pixels.data[index + 1];
      const blue = pixels.data[index + 2];
      const redDominance = Math.max(0, red - (green + blue) * 0.32);
      pixels.data[index + 3] = Math.min(pixels.data[index + 3], Math.min(255, redDominance * 3.8));
    }
    context.putImageData(pixels, 0, 0);
    const processed = new THREE.CanvasTexture(canvas);
    processed.colorSpace = THREE.SRGBColorSpace;
    processed.needsUpdate = true;
    return processed;
  }, [sourceTexture]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <Plane args={size} rotation={[-Math.PI / 2, 0, rotation]} position={position}>
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} />
    </Plane>
  );
};

const GrimeLayer = () => {
  const grimeTexture = useMemo(() => makeTexture('grime'), []);
  useEffect(() => () => grimeTexture.dispose(), [grimeTexture]);
  return (
    <Plane args={[10, 5.72]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.069, 0]} receiveShadow>
      <meshBasicMaterial map={grimeTexture} transparent opacity={0.86} depthWrite={false} side={THREE.DoubleSide} />
    </Plane>
  );
};

const DeskScratches = () => {
  const scratches = [
    [-4.8, -1.65, 1.15, -0.08], [-3.65, -0.45, 0.68, 0.13], [-2.25, 2.05, 1.42, -0.04],
    [-0.9, -1.1, 0.92, 0.2], [0.2, 2.18, 1.26, -0.13], [1.55, -1.75, 1.62, 0.08],
    [3.3, 1.58, 1.36, 0.16], [4.92, -0.3, 0.94, -0.2], [5.52, 1.95, 0.7, 0.05]
  ];
  return (
    <group>
      {scratches.map(([x, z, length, rotation], index) => (
        <Plane key={index} args={[length, index % 3 === 0 ? 0.024 : 0.014]} rotation={[-Math.PI / 2, 0, rotation]} position={[x, 0.077, z]}>
          <meshBasicMaterial color={index % 2 ? '#130b06' : '#a27a4d'} transparent opacity={0.42} side={THREE.DoubleSide} />
        </Plane>
      ))}
    </group>
  );
};

const Desk = () => {
  const { scene } = useGLTF('/assets/models/old_table.glb');
  const desk = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    desk.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
    });
  }, [desk]);

  return (
    <group>
      <Center top position={[0, 0.04, 0]}>
        <primitive object={desk} scale={1} />
      </Center>
      <GrimeLayer />
      <DeskScratches />
      {/* Salpicaduras PNG del paquete aportado, situadas en varias zonas de la cubierta. */}
      <BloodTextureStain file="bloodslash_heavy.png" position={[0.25, 0.081, 1.68]} rotation={-0.16} size={[3.05, 1.72]} opacity={0.62} />
      <BloodTextureStain file="bloodspray.png" position={[-3.75, 0.081, -0.52]} rotation={0.48} size={[2.2, 1.24]} opacity={0.56} />
      <BloodTextureStain file="bloodsplat.png" position={[4.05, 0.081, -1.4]} rotation={-0.1} size={[2.15, 1.2]} opacity={0.6} />
      <BloodTextureStain file="bloodslash2.png" position={[4.65, 0.081, 1.42]} rotation={0.62} size={[1.7, 0.96]} opacity={0.58} />
    </group>
  );
};

const Monitor = ({ onClick, isZooming }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && !isZooming);
  return (
    <group position={[-2, 1.5, -1]} rotation={[0, 0.2, 0]} onClick={!isZooming ? onClick : null} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Base pesada, cuello articulado y carcasa con profundidad. */}
      <RoundedBox args={[1.72, 0.14, 1.08]} radius={0.05} smoothness={2} position={[0, -1.45, 0.04]} castShadow receiveShadow>
        <meshStandardMaterial color="#080909" roughness={0.52} metalness={0.62} />
      </RoundedBox>
      <Box args={[0.22, 1.3, 0.26]} position={[0, -0.82, -0.16]} castShadow receiveShadow>
        <meshStandardMaterial color="#0a0c0d" roughness={0.38} metalness={0.72} />
      </Box>
      <Box args={[0.76, 0.12, 0.48]} position={[0, -0.3, -0.11]} rotation={[0.28, 0, 0]} castShadow>
        <meshStandardMaterial color="#121619" roughness={0.45} metalness={0.68} />
      </Box>
      <RoundedBox args={[3.52, 2.34, 0.42]} radius={0.08} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#111416" roughness={0.36} metalness={0.74} />
      </RoundedBox>
      {/* Bisel interior y vidrio hundido: evita el aspecto de caja plana. */}
      <RoundedBox args={[3.27, 2.09, 0.07]} radius={0.025} smoothness={2} position={[0, 0, 0.235]}>
        <meshStandardMaterial color="#020706" roughness={0.2} metalness={0.55} />
      </RoundedBox>
      <Plane args={[3.06, 1.88]} position={[0, 0.02, 0.277]}>
        <meshBasicMaterial color={hovered ? "#2ba85c" : "#0a2c1a"} />
      </Plane>
      <Box args={[0.16, 0.08, 0.04]} position={[1.48, -1.01, 0.27]}>
        <meshBasicMaterial color={hovered ? "#5cff8f" : "#214c31"} />
      </Box>
      <pointLight position={[0, 0, 1]} intensity={hovered ? 3 : 1.1} distance={8} color="#2ecc71" />
      <Text position={[0, 0, 0.29]} fontSize={0.25} color="#020604">
        {hovered ? "> ACCEDER" : "SYS.ONLINE"}
      </Text>
    </group>
  );
};

const DocumentFolder = ({ onClick, isZooming }) => {
  const [hovered, setHovered] = useState(false);
  const paperTexture = useMemo(() => makeTexture('paper'), []);
  useCursor(hovered && !isZooming);
  useEffect(() => () => paperTexture.dispose(), [paperTexture]);

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
        <meshStandardMaterial color="#3d5da2" roughness={0.76} />
      </Plane>
      <Plane args={[1.14, 1.52]} position={[0.08, 0.03, 0.092]} receiveShadow>
        <meshStandardMaterial map={paperTexture} color="#c7b99b" roughness={0.98} />
      </Plane>
      <Plane args={[1.2, 1.63]} position={[-0.08, 0, 0.101]} receiveShadow castShadow>
        <meshStandardMaterial color="#476ebc" roughness={0.75} />
      </Plane>
      <Box args={[0.6, 0.14, 0.014]} position={[0, 0, 0.112]}>
        <meshStandardMaterial color="#b8a57d" roughness={0.7} metalness={0.15} />
      </Box>
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




const ImportedCamera = () => {
  const { scene } = useGLTF('/assets/models/low_poly_outlast_camera.glb');
  const cameraModel = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cameraModel.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
    });
  }, [cameraModel]);

  return (
    <group position={[-4.6, 0.7, -0.7]} rotation={[0, 1, 0]} scale={5}>
      <Center>
        <primitive object={cameraModel} />
      </Center>
    </group>
  );
};

const Keyboard = () => {
  const { scene } = useGLTF('/assets/models/keyboard.glb');
  const keyboard = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    keyboard.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
    });
  }, [keyboard]);

  return (
    <group position={[-2.55, 0.12, 1.4]} rotation={[0, 0.1, 0]} scale={10.0}>
      <Center>
        <primitive object={keyboard} />
      </Center>
    </group>
  );
};

const Mouse = () => (
  <group position={[0.15, 0.15, 1.38]} rotation={[0, -0.18, 0]}>
    <mesh scale={[0.24, 0.1, 0.36]} castShadow receiveShadow>
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial color="#161714" roughness={0.43} metalness={0.5} />
    </mesh>
    <Box args={[0.012, 0.015, 0.27]} position={[0, 0.092, -0.06]}>
      <meshBasicMaterial color="#060706" />
    </Box>
    <mesh position={[0, 0.107, -0.085]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.031, 0.031, 0.025, 12]} />
      <meshStandardMaterial color="#aaa180" roughness={0.46} metalness={0.48} />
    </mesh>
    <mesh position={[0, 0.067, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.12, 0.008, 6, 16, Math.PI]} />
      <meshBasicMaterial color="#2f342e" />
    </mesh>
  </group>
);

const FloatingDust = () => {
  const dustData = useMemo(() => {
    const positions = new Float32Array(125 * 3);
    const base = new Float32Array(125 * 3);
    const speeds = new Float32Array(125);
    for (let i = 0; i < positions.length; i += 3) {
      const y = 0.3 + Math.random() * 3.9;
      const radius = 0.18 + (5 - y) * 0.16;
      base[i] = 0.6 + (Math.random() - 0.5) * radius * 2;
      base[i + 1] = y;
      base[i + 2] = 1.4 + (Math.random() - 0.5) * radius * 1.35;
      positions[i] = base[i];
      positions[i + 1] = base[i + 1];
      positions[i + 2] = base[i + 2];
      speeds[i / 3] = 0.15 + Math.random() * 0.32;
    }
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, 'rgba(255, 245, 220, 0.8)');
    glow.addColorStop(0.25, 'rgba(255, 245, 220, 0.3)');
    glow.addColorStop(1, 'rgba(255, 245, 220, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(canvas);
    return { positions, base, speeds, sprite };
  }, []);
  const dust = useRef();
  const geometry = useRef();
  useFrame(({ clock }) => {
    if (geometry.current) {
      const time = clock.getElapsedTime();
      const positions = geometry.current.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const speed = dustData.speeds[i / 3];
        positions[i] = dustData.base[i] + Math.sin(time * speed + i) * 0.08;
        positions[i + 1] = dustData.base[i + 1] + Math.sin(time * speed * 0.7 + i * 0.3) * 0.13;
        positions[i + 2] = dustData.base[i + 2] + Math.cos(time * speed * 0.8 + i) * 0.06;
      }
      geometry.current.attributes.position.needsUpdate = true;
    }
  });
  useEffect(() => () => dustData.sprite.dispose(), [dustData]);
  return (
    <points ref={dust}>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[dustData.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={dustData.sprite} color="#f3dcad" size={0.023} transparent opacity={0.22} alphaTest={0.02} depthWrite={false} sizeAttenuation />
    </points>
  );
};

const Clutter = () => (
  <group>
    {/* Stack of folders */}
    <Box args={[1.5, 1.2, 2]} position={[3.5, 0.6, -0.5]} rotation={[0, -0.2, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </Box>
    <Box args={[1.6, 0.1, 2.1]} position={[3.5, 1.25, -0.5]} rotation={[0, -0.2, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#2d426b" roughness={0.8} />
    </Box>
    <Keyboard />
    <Mouse />
    <ImportedCamera />
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
          <pointLight position={[-3.8, 1.15, 0.7]} intensity={16} distance={4.6} color="#d7a76d" />

          <Room />
          <Suspense fallback={null}>
            <Desk />
            <Monitor onClick={() => handleOpen('terminal')} isZooming={animatingTo !== 'none'} />
            <DocumentFolder onClick={() => handleOpen('document')} isZooming={animatingTo !== 'none'} />
            <Clutter />
          </Suspense>
          <FloatingDust />

          <CameraController
            target={animatingTo}
            onReachedTarget={(target) => {
              if (activeOverlay !== target) setActiveOverlay(target);
            }}
          />

        </Canvas>
      </div>

      {/* Overlays */}
      {activeOverlay === 'document' && <DocumentOverlay onClose={handleClose} />}
      {activeOverlay === 'terminal' && <TerminalOverlay onClose={handleClose} />}
    </div>
  );
}
