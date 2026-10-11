import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Plane, Text, useCursor, RoundedBox, useGLTF, useTexture, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import InvestigationFiles from './InvestigationFiles.jsx';
import OutlastCamcorderOverlay from './OutlastCamcorderOverlay.jsx';
import OutlastDocumentOverlay from './OutlastDocumentOverlay.jsx';
import WindowsXPScreen from './WindowsXPScreen.jsx';

// ---- 3D Models & Enclosed Asylum Office ----
const AsylumDoor = () => (
  <group position={[6.2, -0.35, -5.14]}>
    {/* Marco metálico de la puerta pesada de manicomio (desde el suelo y = -4 hasta y = 3.3, a la misma altura del tablero) */}
    <Box args={[3.4, 7.3, 0.26]} position={[0, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#141816" roughness={0.7} metalness={0.6} />
    </Box>
    {/* Hoja de la puerta de madera maciza hospitalaria blindada */}
    <Box args={[3.06, 6.98, 0.16]} position={[0, -0.06, 0.05]} castShadow receiveShadow>
      <meshStandardMaterial color="#2c221a" roughness={0.85} metalness={0.1} />
    </Box>
    {/* Plancha de protección de acero en la parte inferior descansando directamente en el suelo */}
    <Box args={[3.02, 1.8, 0.18]} position={[0, -2.65, 0.06]} castShadow receiveShadow>
      <meshStandardMaterial color="#3a3d3a" roughness={0.5} metalness={0.8} />
    </Box>
    {/* Ventana de observación rectangular con barras a la altura natural de los ojos */}
    <group position={[0, 1.55, 0.06]}>
      <Box args={[0.88, 1.45, 0.18]}>
        <meshStandardMaterial color="#0b0e0c" roughness={0.4} />
      </Box>
      {/* Cristal reforzado esmerilado */}
      <Plane args={[0.72, 1.28]} position={[0, 0, 0.09]}>
        <meshStandardMaterial color="#2d4251" roughness={0.3} metalness={0.4} transparent opacity={0.85} />
      </Plane>
      {/* Barrotes de seguridad */}
      {[-0.22, 0, 0.22].map((x, i) => (
        <Box key={i} args={[0.035, 1.28, 0.035]} position={[x, 0, 0.11]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.3} />
        </Box>
      ))}
    </group>
    {/* Barra antipánico / manija pesada industrial de manicomio */}
    <Box args={[0.12, 0.55, 0.2]} position={[-1.2, 0.05, 0.12]} castShadow>
      <meshStandardMaterial color="#a0a5a0" metalness={0.85} roughness={0.35} />
    </Box>
    <Box args={[2.4, 0.08, 0.14]} position={[0, 0.05, 0.12]} castShadow>
      <meshStandardMaterial color="#787e78" metalness={0.8} roughness={0.3} />
    </Box>
    {/* Letrero institucional de Murkoff en la parte superior */}
    <Plane args={[2.0, 0.36]} position={[0, 2.85, 0.12]}>
      <meshStandardMaterial color="#0c0e0c" roughness={0.5} />
    </Plane>
    <Text position={[0, 2.85, 0.13]} fontSize={0.13} color="#e6dec8">
      PABELLÓN D // CONSULTA 04
    </Text>
    {/* Haz frío de luz que se filtra por debajo y por la mirilla desde el pasillo exterior del pabellón */}
    <pointLight position={[0, -3.5, 0.4]} intensity={4.5} distance={4.2} color="#1d4d3d" />
    <pointLight position={[0, 1.55, 0.3]} intensity={2.4} distance={2.8} color="#5e1212" />
  </group>
);

const AsylumExitSign = ({ position = [6.2, 1.95, -5.12] }) => {
  const lightRef = useRef();
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (lightRef.current) {
      // Oscilación tenue y zumbido del letrero de salida de emergencia
      const flicker = Math.sin(time * 8.5) > 0.86 ? 0.35 : (0.85 + Math.sin(time * 2.8) * 0.15);
      lightRef.current.intensity = 2.4 * flicker;
    }
  });

  return (
    <group position={position}>
      {/* Carcasa de chapa oxidada */}
      <Box args={[1.2, 0.46, 0.16]} castShadow>
        <meshStandardMaterial color="#1a1c1a" roughness={0.7} metalness={0.6} />
      </Box>
      {/* Pantalla difusora con rótulo de salida iluminado */}
      <Plane args={[1.05, 0.36]} position={[0, 0, 0.086]}>
        <meshBasicMaterial color="#300505" />
      </Plane>
      <Text position={[0, 0, 0.092]} fontSize={0.18} color="#ff3333" letterSpacing={0.12}>
        SALIDA
      </Text>
      <pointLight ref={lightRef} position={[0, -0.1, 0.25]} intensity={2.4} distance={3.8} color="#aa1515" />
    </group>
  );
};

const BloodWallWritings = () => (
  <group>
    {/* Mensaje principal sangriento en la pared frontal sobre los bloques de hormigón (Referencia Foto 1) */}
    <group position={[-1.2, 3.2, -5.14]}>
      {/* Palabra principal chorreante en sangre oscura */}
      <Text
        font="/assets/fonts/Nosifer.ttf"
        fontSize={0.68}
        color="#540404"
        letterSpacing={0.12}
        anchorX="center"
        anchorY="middle"
      >
        OBSERVA
      </Text>

      {/* Segunda línea ensangrentada y tachada estilo paciente psiquiátrico (Foto 1) */}
      <Text
        position={[0, -0.72, 0]}
        font="/assets/fonts/Creepster.ttf"
        fontSize={0.44}
        color="#480303"
        letterSpacing={0.08}
        anchorX="center"
        anchorY="middle"
      >
        LA VERDAD
      </Text>

      {/* Inscripciones frenéticas repetidas en sangre alrededor de las letras principales (Foto 1) */}
      {[
        [-2.3, 0.65, 0.17, -0.06, 'OBSERVA'],
        [2.1, 0.58, 0.16, 0.05, 'OBSERVA'],
        [-2.6, -0.45, 0.15, 0.08, 'NO HAY SALIDA'],
        [2.3, -0.52, 0.16, -0.07, 'CASO COLCHAGUA'],
        [-1.8, 1.05, 0.14, 0.04, 'DATAMART'],
        [1.6, 1.02, 0.15, -0.05, 'OBSERVAN'],
        [-0.8, -1.25, 0.16, 0.02, 'OBSERVA'],
        [1.1, -1.22, 0.15, -0.03, 'LA VERDAD'],
        [-3.2, 0.15, 0.14, -0.09, 'TERAPIA'],
        [3.0, 0.12, 0.14, 0.06, 'OBSERVA']
      ].map(([x, y, size, rot, text], i) => (
        <Text
          key={i}
          position={[x, y, 0.002]}
          rotation={[0, 0, rot]}
          font="/assets/fonts/RockSalt.ttf"
          fontSize={size}
          color="#380303"
          letterSpacing={0.06}
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      ))}

      {/* Chorretones verticales gruesos de sangre que bajan por las juntas del hormigón hacia el piso (Foto 1) */}
      {[-2.2, -1.7, -1.2, -0.8, -0.2, 0.4, 0.9, 1.5, 2.1].map((x, i) => (
        <Box
          key={i}
          args={[0.024 + (i % 3) * 0.012, 1.2 + (i % 4) * 0.45, 0.006]}
          position={[x, -1.1 - (i % 3) * 0.25, 0.005]}
        >
          <meshStandardMaterial color="#2d0202" roughness={0.65} opacity={0.92} transparent />
        </Box>
      ))}
    </group>

    {/* Inscripciones en la pared lateral izquierda junto al conducto de ventilación */}
    <group position={[-9.43, 0.8, -2.8]} rotation={[0, Math.PI / 2, 0]}>
      <Text
        font="/assets/fonts/Nosifer.ttf"
        fontSize={0.34}
        color="#420404"
        letterSpacing={0.05}
        anchorX="center"
        anchorY="middle"
      >
        NO HAY SALIDA
      </Text>
      <Text
        position={[0, -0.55, 0]}
        font="/assets/fonts/Creepster.ttf"
        fontSize={0.24}
        color="#380303"
        letterSpacing={0.08}
        anchorX="center"
        anchorY="middle"
      >
        PURIFICACION POR DATOS
      </Text>
      {[-1.2, -0.6, 0.4, 1.0].map((x, i) => (
        <Box key={i} args={[0.02, 0.55 + (i % 3) * 0.2, 0.005]} position={[x, -0.35, 0.005]}>
          <meshStandardMaterial color="#2d0202" roughness={0.7} opacity={0.82} transparent />
        </Box>
      ))}
    </group>

    {/* Inscripción conspirativa de Murkoff cerca del archivador */}
    <group position={[4.6, -1.8, -5.14]} rotation={[0, 0, -0.04]}>
      <Text
        font="/assets/fonts/RockSalt.ttf"
        fontSize={0.19}
        color="#3e0505"
        letterSpacing={0.04}
        anchorX="center"
        anchorY="middle"
      >
        MURKOFF MIENTE // TERAPIA COGNITIVA
      </Text>
    </group>
  </group>
);

const FlickeringFluorescentFixture = ({ position = [0, 5.05, 0.8], isCamcorderActive = false }) => {
  const lightRef = useRef();
  const tubeMatRef = useRef();

  useFrame(({ clock }) => {
    if (isCamcorderActive) {
      if (lightRef.current) lightRef.current.intensity = 0;
      if (tubeMatRef.current) tubeMatRef.current.emissiveIntensity = 0.05;
      return;
    }

    const time = clock.getElapsedTime();
    // Zumbido eléctrico y oscilación de tubo fluorescente de hospital psiquiátrico
    const hum = Math.sin(time * 55) * 0.08 + Math.cos(time * 26) * 0.05;
    // Cortes repentinos por sobretensión / balastro dañado
    const dip = Math.sin(time * 1.9) > 0.92 ? 0.32 : 1.0;
    const spark = Math.random() < 0.014 ? 0.12 : 1.0;
    const factor = Math.max(0.08, (1 + hum) * dip * spark);

    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 420 * factor, 0.22);
    }
    if (tubeMatRef.current) {
      tubeMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(tubeMatRef.current.emissiveIntensity, 1.35 * factor, 0.22);
    }
  });

  return (
    <group position={position}>
      {/* Armazón metálico suspendido con pátina y óxido */}
      <Box args={[3.8, 0.16, 0.55]} castShadow>
        <meshStandardMaterial color="#1a1d1b" roughness={0.75} metalness={0.65} />
      </Box>
      {/* Cables / tirantes de fijación al techo */}
      {[-1.6, 1.6].map((x, i) => (
        <Box key={i} args={[0.02, 0.2, 0.02]} position={[x, 0.15, 0]}>
          <meshStandardMaterial color="#0b0d0c" metalness={0.9} roughness={0.2} />
        </Box>
      ))}
      {/* Tubos fluorescentes dobles */}
      {[-0.12, 0.12].map((z, i) => (
        <mesh key={i} position={[0, -0.1, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 3.4, 12]} />
          <meshStandardMaterial
            ref={i === 0 ? tubeMatRef : null}
            color="#8fa37e"
            emissive="#a6bfa0"
            emissiveIntensity={1.2}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Rejilla de protección industrial */}
      <Box args={[3.6, 0.02, 0.48]} position={[0, -0.16, 0]}>
        <meshStandardMaterial color="#2d332f" metalness={0.8} roughness={0.4} wireframe />
      </Box>
      {/* Foco de luz verdosa sucia institucional */}
      <spotLight
        ref={lightRef}
        position={[0, -0.2, 0]}
        target-position={[0, -4, 0]}
        angle={1.15}
        penumbra={0.85}
        intensity={420}
        distance={14}
        color="#8da57a"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0003}
      />
    </group>
  );
};



const FilingCabinet = ({ position = [8.3, -1.9, -4.2], rotation = [0, -0.35, 0] }) => (
  <group position={position} rotation={rotation}>
    {/* Estructura del archivador de 4 cajones */}
    <Box args={[1.3, 4.2, 1.5]} position={[0, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#1f2622" roughness={0.65} metalness={0.55} />
    </Box>
    {/* 4 Cajones metálicos con manijas */}
    {[-1.4, -0.45, 0.5, 1.45].map((y, i) => (
      <group key={i} position={[0, y, 0.76]}>
        <Box args={[1.18, 0.82, 0.04]} castShadow>
          <meshStandardMaterial color="#262f2a" roughness={0.55} metalness={0.6} />
        </Box>
        {/* Manija cromada */}
        <Box args={[0.34, 0.05, 0.08]} position={[0, 0.05, 0.04]}>
          <meshStandardMaterial color="#8a928e" metalness={0.8} roughness={0.3} />
        </Box>
        {/* Porta-etiquetas */}
        <Box args={[0.22, 0.12, 0.02]} position={[0, -0.15, 0.03]}>
          <meshStandardMaterial color="#dfd4b8" roughness={0.9} />
        </Box>
      </group>
    ))}
  </group>
);

const OfficeShelf = ({ position = [9.1, -1.1, 1.5], rotation = [0, -Math.PI / 2, 0] }) => (
  <group position={position} rotation={rotation}>
    {/* Armazón metálico de la estantería */}
    <Box args={[3.2, 5.4, 0.8]} position={[0, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#161816" roughness={0.7} metalness={0.7} />
    </Box>
    {/* 4 Baldas con archivadores y cajas de historiales clínicos */}
    {[-1.8, -0.6, 0.6, 1.8].map((y, shelfIdx) => (
      <group key={shelfIdx} position={[0, y, 0]}>
        <Box args={[3.1, 0.06, 0.74]} position={[0, -0.38, 0]}>
          <meshStandardMaterial color="#252725" metalness={0.6} />
        </Box>
        {/* Fila de carpetas y archivadores de cartón */}
        {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.1].map((x, fileIdx) => {
          const colors = ['#1e293b', '#3b1c1c', '#1e382b', '#42331c', '#27272a'];
          const color = colors[(shelfIdx + fileIdx) % colors.length];
          return (
            <Box key={fileIdx} args={[0.22, 0.7, 0.52]} position={[x, 0, 0.04]} castShadow>
              <meshStandardMaterial color={color} roughness={0.85} />
            </Box>
          );
        })}
      </group>
    ))}
  </group>
);

const InvestigationCorkboard = () => (
  <group position={[1.8, 2.2, -5.14]}>
    {/* Marco de madera de la pizarra */}
    <Box args={[3.6, 2.2, 0.08]} castShadow>
      <meshStandardMaterial color="#3a2717" roughness={0.9} />
    </Box>
    {/* Tablero de corcho */}
    <Plane args={[3.4, 2.0]} position={[0, 0, 0.045]}>
      <meshStandardMaterial color="#916a47" roughness={0.95} />
    </Plane>
    {/* Hojas y notas de investigación clavadas */}
    {[
      [-1.1, 0.4, 0.05, 0.08, '#d4c9aa'],
      [-0.4, 0.5, 0.052, -0.05, '#e0d8c2'],
      [0.6, 0.3, 0.05, 0.03, '#bfb291'],
      [1.1, -0.3, 0.052, -0.09, '#c8bc9f'],
      [-0.8, -0.4, 0.051, 0.12, '#8a0303'],
      [0.1, -0.35, 0.053, -0.02, '#ded3b6']
    ].map(([x, y, z, rot, col], idx) => (
      <Plane key={idx} args={[0.42, 0.54]} position={[x, y, z]} rotation={[0, 0, rot]}>
        <meshStandardMaterial color={col} roughness={0.9} />
      </Plane>
    ))}
    {/* Cordel rojo de conexión de pistas */}
    <Box args={[1.5, 0.015, 0.02]} position={[-0.3, 0.1, 0.056]} rotation={[0, 0, -0.35]}>
      <meshBasicMaterial color="#b30000" />
    </Box>
  </group>
);

const AirDuctVent = () => (
  <group position={[-9.45, 2.2, -1]} rotation={[0, Math.PI / 2, 0]}>
    {/* Marco metálico del conducto de ventilación */}
    <Box args={[1.8, 1.2, 0.1]} castShadow>
      <meshStandardMaterial color="#222624" roughness={0.6} metalness={0.7} />
    </Box>
    {/* Interior oscuro */}
    <Plane args={[1.55, 0.95]} position={[0, 0, 0.052]}>
      <meshBasicMaterial color="#020403" />
    </Plane>
    {/* Lamas horizontales de la rejilla */}
    {[-0.35, -0.2, -0.05, 0.1, 0.25, 0.4].map((y, i) => (
      <Box key={i} args={[1.52, 0.04, 0.03]} position={[0, y, 0.06]}>
        <meshStandardMaterial color="#424744" metalness={0.7} roughness={0.5} />
      </Box>
    ))}
  </group>
);

const AnatomicalSkeleton = () => {
  const { scene } = useGLTF('/assets/models/skeleton.glb');
  const skeletonModel = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    skeletonModel.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
      if (object.material) {
        object.material.roughness = 0.85;
      }
    });
  }, [skeletonModel]);

  return (
    <group position={[-7.6, -1.8, -3.8]} rotation={[0, 0.65, 0]} scale={2.6}>
      <Center bottom>
        <primitive object={skeletonModel} />
      </Center>
      {/* Soporte vertical y peana de clínica */}
      <Box args={[0.04, 4.6, 0.04]} position={[0, 2.2, -0.15]}>
        <meshStandardMaterial color="#1d201e" metalness={0.8} roughness={0.3} />
      </Box>
      <Box args={[0.8, 0.05, 0.8]} position={[0, 0.02, -0.15]}>
        <meshStandardMaterial color="#161817" metalness={0.7} roughness={0.4} />
      </Box>
    </group>
  );
};

// Linterna Infrarroja (IR Spotlight) fijada directamente al visor óptico de la cámara (cero desfase de trackeo)
const CamcorderIRSpotlight = ({ active, zoom = 1.0 }) => {
  const lightRef = useRef();
  const fillLightRef = useRef();
  const { camera, scene } = useThree();

  // Target persistente rígidamente fijado en el eje óptico local de la cámara (hacia donde apunta la cruz)
  const targetObject = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.name = 'CamcorderIRTarget';
    obj.position.set(0, 0, -22);
    return obj;
  }, []);

  useEffect(() => {
    if (!camera.parent) scene.add(camera);
    camera.add(targetObject);

    const spot = lightRef.current;
    if (spot) {
      camera.add(spot);
      spot.target = targetObject;
      spot.position.set(0, 0, 0);
    }

    const fill = fillLightRef.current;
    if (fill) {
      camera.add(fill);
      fill.position.set(0, 0, 0);
    }

    return () => {
      camera.remove(targetObject);
      if (spot) camera.remove(spot);
      if (fill) camera.remove(fill);
    };
  }, [camera, scene, targetObject]);

  // Ajustar el ángulo del cono de luz según el nivel de zoom para concentrar el haz
  const beamAngle = Math.max(0.28, 0.58 / zoom);

  useFrame(() => {
    const spot = lightRef.current;
    if (spot) {
      spot.position.set(0, 0, 0);
      targetObject.position.set(0, 0, -22);
      spot.target = targetObject;
      spot.intensity = active ? 740 : 0;
    }
    if (fillLightRef.current) {
      fillLightRef.current.position.set(0, 0, 0);
      fillLightRef.current.intensity = active ? 1.6 : 0;
    }
  });

  return (
    <>
      {/* Foco de infrarrojos que ilumina con alto contraste exactamente al centro de la cruz de la cámara */}
      <spotLight
        ref={lightRef}
        intensity={active ? 740 : 0}
        distance={32}
        angle={beamAngle}
        penumbra={0.72}
        color="#72fca0"
        decay={1.65}
        castShadow={false}
      />
      {/* Luz ambiente local en la cámara para bañar sutilmente el entorno cercano */}
      <pointLight
        ref={fillLightRef}
        intensity={active ? 1.6 : 0}
        distance={3.8}
        color="#2b7548"
      />
    </>
  );
};

// Material PBR para los muros de bloques de hormigón del hospital psiquiátrico (Foto 1)
const HospitalWallMaterial = ({ repeat = [5.5, 2.6], color = '#7c8b83' }) => {
  const [diffuse, normal, roughness] = useTexture([
    '/assets/textures/wall/concrete_block_wall_diff_1k.jpg',
    '/assets/textures/wall/concrete_block_wall_nor_1k.jpg',
    '/assets/textures/wall/concrete_block_wall_rough_1k.jpg'
  ]);

  useEffect(() => {
    [diffuse, normal, roughness].forEach((tex) => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeat[0], repeat[1]);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
      }
    });
  }, [diffuse, normal, roughness, repeat]);

  return (
    <meshStandardMaterial
      map={diffuse}
      normalMap={normal}
      roughnessMap={roughness}
      color={color}
      roughness={0.92}
      metalness={0.04}
    />
  );
};

const Room = ({ isCamcorderActive = false }) => (
  <group>
    {/* Suelo: Baldosas clínicas institucionales de hospital manchadas y desgastadas */}
    <Plane args={[20, 14]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 1.2]} receiveShadow>
      <meshStandardMaterial color="#0c0e0d" roughness={0.84} metalness={0.15} />
    </Plane>

    {/* Techo completamente cerrado: Placas acústicas industriales */}
    <Plane args={[20, 14]} rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, 1.2]} receiveShadow>
      <meshStandardMaterial color="#080a09" roughness={0.95} />
    </Plane>

    {/* Lámparas fluorescentes parpadeantes de hospital con luz verdosa sucia */}
    <FlickeringFluorescentFixture position={[0, 5.05, 0.8]} isCamcorderActive={isCamcorderActive} />
    <FlickeringFluorescentFixture position={[-4.5, 5.05, -1.8]} isCamcorderActive={isCamcorderActive} />

    {/* Paredes con textura PBR de bloques de hormigón y zócalo institucional (Referencia Foto 1) */}
    <Suspense fallback={null}>
      {/* Pared Frontal con división de bloques superiores y base más oscura */}
      <group position={[0, 0.6, -5.2]}>
        <Plane args={[20, 6.4]} position={[0, 1.5, 0]} receiveShadow>
          <HospitalWallMaterial repeat={[5.5, 1.8]} color="#88968f" />
        </Plane>
        {/* Moldura divisoria de mortero / zócalo intermedio */}
        <Box args={[20, 0.12, 0.05]} position={[0, -1.7, 0.02]} receiveShadow>
          <meshStandardMaterial color="#2d332e" roughness={0.8} />
        </Box>
        {/* Sección inferior más oscura con pátina y humedad */}
        <Plane args={[20, 2.8]} position={[0, -3.1, 0]} receiveShadow>
          <HospitalWallMaterial repeat={[5.5, 0.8]} color="#48534c" />
        </Plane>
      </group>

      {/* Pared Trasera */}
      <Plane args={[20, 9.4]} rotation={[0, Math.PI, 0]} position={[0, 0.6, 7.5]} receiveShadow>
        <HospitalWallMaterial repeat={[5.5, 2.6]} color="#7c8880" />
      </Plane>

      {/* Pared Izquierda */}
      <Plane args={[14, 9.4]} rotation={[0, Math.PI / 2, 0]} position={[-9.5, 0.6, 1.2]} receiveShadow>
        <HospitalWallMaterial repeat={[4.0, 2.6]} color="#808d86" />
      </Plane>

      {/* Pared Derecha */}
      <Plane args={[14, 9.4]} rotation={[0, -Math.PI / 2, 0]} position={[9.5, 0.6, 1.2]} receiveShadow>
        <HospitalWallMaterial repeat={[4.0, 2.6]} color="#808d86" />
      </Plane>
    </Suspense>

    {/* Zócalo de suelo */}
    <Box args={[20, 0.35, 0.1]} position={[0, -3.85, -5.15]} receiveShadow>
      <meshStandardMaterial color="#070908" roughness={0.7} metalness={0.3} />
    </Box>
    <Box args={[20, 0.35, 0.1]} position={[0, -3.85, 7.45]} receiveShadow>
      <meshStandardMaterial color="#070908" roughness={0.7} metalness={0.3} />
    </Box>
    <Box args={[0.1, 0.35, 14]} position={[-9.45, -3.85, 1.2]} receiveShadow>
      <meshStandardMaterial color="#070908" roughness={0.7} metalness={0.3} />
    </Box>
    <Box args={[0.1, 0.35, 14]} position={[9.45, -3.85, 1.2]} receiveShadow>
      <meshStandardMaterial color="#070908" roughness={0.7} metalness={0.3} />
    </Box>

    {/* Rótulo de SALIDA iluminado en rojo sobre la puerta pesada (ahora a y = 3.7 directamente sobre el marco) */}
    <AsylumExitSign position={[6.2, 3.7, -5.12]} />

    {/* Mensajes en sangre de pacientes / Padre Martin sobre los muros */}
    <BloodWallWritings />

    {/* Regueros de sangre, salpicaduras y marcas de arrastre estilo Outlast */}
    <Suspense fallback={null}>
      {/* Rastro de arrastre que sale por debajo de la puerta hacia el pasillo */}
      <BloodTextureStain file="bloodslash_heavy.png" position={[6.2, -3.97, -3.6]} rotation={1.57} size={[3.2, 1.8]} opacity={0.75} />
      {/* Salpicaduras de sangre en la pared cerca de la puerta */}
      <BloodTextureStain file="bloodspray.png" position={[5.2, 0.4, -5.13]} planeRotation={[0, 0, 0.25]} size={[2.2, 1.4]} opacity={0.65} />
      {/* Mancha y salpicón vertical en la pared detrás del escritorio */}
      <BloodTextureStain file="bloodslash1.png" position={[-1.2, 2.6, -5.13]} planeRotation={[0, 0, -0.15]} size={[2.4, 1.3]} opacity={0.68} />
      {/* Charco bajo la peana del esqueleto anatómico */}
      <BloodTextureStain file="bloodsplat.png" position={[-7.6, -3.97, -3.8]} rotation={0.4} size={[2.4, 1.5]} opacity={0.65} />
    </Suspense>

    {/* Elementos arquitectónicos y de atrezo de la oficina */}
    <AsylumDoor />
    <FilingCabinet />
    <OfficeShelf />
    <InvestigationCorkboard />
    <AirDuctVent />
    <Suspense fallback={null}>
      <AnatomicalSkeleton />
    </Suspense>
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

const BloodTextureStain = ({ file, position, rotation = 0, planeRotation = null, size, opacity = 1 }) => {
  const sourceTexture = useTexture(`/assets/textures/BlueRoseSonata%20Blood%20FX%20Pack/${file}`);

  useEffect(() => {
    if (sourceTexture) {
      sourceTexture.colorSpace = THREE.SRGBColorSpace;
      sourceTexture.needsUpdate = true;
    }
  }, [sourceTexture]);

  const finalRotation = planeRotation || [-Math.PI / 2, 0, rotation];

  return (
    <Plane args={size} rotation={finalRotation} position={position}>
      <meshStandardMaterial
        map={sourceTexture}
        transparent
        opacity={opacity}
        alphaTest={0.02}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-1}
        roughness={0.65}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
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

const Desk = () => {
  const woodTexture = useMemo(() => makeTexture('wood'), []);
  useEffect(() => () => woodTexture.dispose(), [woodTexture]);

  return (
    <group>
      {/* Tabla de madera pesada de hospital, con canto y patas visibles en la penumbra */}
      <RoundedBox args={[14, 0.48, 6]} radius={0.07} smoothness={3} position={[0, -0.2, 0]} receiveShadow castShadow>
        <meshStandardMaterial map={woodTexture} color="#76583c" roughness={0.91} metalness={0} />
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
      <GrimeLayer />
      {/* Salpicaduras PNG orgánicas situadas naturalmente sobre la cubierta sin cortes abruptos */}
      <BloodTextureStain file="bloodsplat.png" position={[0.2, 0.081, 1.45]} rotation={-0.1} size={[2.2, 1.25]} opacity={0.52} />
      <BloodTextureStain file="bloodspray.png" position={[-3.75, 0.081, -0.52]} rotation={0.48} size={[2.2, 1.24]} opacity={0.56} />
      <BloodTextureStain file="bloodsplat.png" position={[4.05, 0.081, -1.4]} rotation={-0.1} size={[2.15, 1.2]} opacity={0.6} />
      <BloodTextureStain file="bloodslash2.png" position={[4.65, 0.081, 1.42]} rotation={0.62} size={[1.7, 0.96]} opacity={0.58} />
    </group>
  );
};

const Monitor = ({ onClick, isZooming, isScreenActive, onClose, onHover, onUnhover }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && !isZooming && !isScreenActive);

  return (
    <group
      position={[-2, 1.5, -1]}
      rotation={[0, 0.2, 0]}
      onClick={!isZooming && !isScreenActive ? onClick : null}
      onPointerOver={() => {
        setHovered(true);
        if (onHover && !isZooming && !isScreenActive) onHover('terminal');
      }}
      onPointerOut={() => {
        setHovered(false);
        if (onUnhover) onUnhover();
      }}
    >
      {/* Base pesada, cuello articulado y carcasa con profundidad */}
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
      {/* Bisel interior y vidrio hundido */}
      <RoundedBox args={[3.27, 2.09, 0.07]} radius={0.025} smoothness={2} position={[0, 0, 0.235]}>
        <meshStandardMaterial color="#020706" roughness={0.2} metalness={0.55} />
      </RoundedBox>

      {/* Pantalla base oscura de fondo */}
      <Plane args={[3.06, 1.88]} position={[0, 0.02, 0.27]}>
        <meshBasicMaterial color="#00138c" />
      </Plane>

      {/* LED de encendido del monitor */}
      <Box args={[0.16, 0.08, 0.04]} position={[1.48, -1.01, 0.27]}>
        <meshBasicMaterial color="#3585ff" />
      </Box>

      {/* Luz ambiente emitida por la pantalla azul de Windows XP sobre el escritorio */}
      <pointLight position={[0, 0, 0.9]} intensity={1.8} distance={5} color="#2a68e8" />

      {/* Pantalla Interactiva Windows XP alojada físicamente en el monitor */}
      <group position={[0, 0.02, 0.282]}>
        <Html
          transform
          position={[0, 0, 0]}
          scale={0.11953}
          wrapperClass="xp-screen-container"
        >
          <div
            style={{ width: '1024px', height: '629px' }}
            className="rounded-sm overflow-hidden select-none shadow-2xl"
          >
            <WindowsXPScreen
              isZoomedIn={isScreenActive}
              onZoomIn={onClick}
              onClose={onClose}
            />
          </div>
        </Html>
      </group>
    </group>
  );
};

// Generador de textura de carpeta confidencial manila / gris con sello carmesí (Foto 4)
const makeFolderTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Fondo cartón desgastado gris-beige (Foto 4)
  ctx.fillStyle = '#68645a';
  ctx.fillRect(0, 0, 512, 512);

  // Fibras y grano de cartón desgastado
  for (let i = 0; i < 4500; i += 1) {
    const alpha = 0.03 + Math.random() * 0.08;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(20, 18, 14, ${alpha})` : `rgba(230, 222, 205, ${alpha})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  // Manchas de humedad y manipulación
  for (let i = 0; i < 35; i += 1) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = 25 + Math.random() * 65;
    const patch = ctx.createRadialGradient(x, y, 0, x, y, radius);
    patch.addColorStop(0, 'rgba(15, 12, 8, 0.12)');
    patch.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = patch;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sello estampado "CONFIDENTIAL" con doble marco en carmesí oscuro (Foto 4)
  ctx.save();
  ctx.translate(256, 256);
  ctx.rotate(-0.025);

  // Marco exterior
  ctx.strokeStyle = '#5a1212';
  ctx.lineWidth = 5.5;
  ctx.strokeRect(-165, -52, 330, 104);

  // Marco interior fino
  ctx.lineWidth = 1.8;
  ctx.strokeRect(-158, -45, 316, 90);

  // Texto CONFIDENTIAL
  ctx.font = 'bold 36px "Courier Prime", monospace';
  ctx.fillStyle = '#5a1212';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '5px';
  ctx.fillText('CONFIDENTIAL', 0, 0);

  // Micro-desgastes en el sello de tinta
  for (let i = 0; i < 160; i += 1) {
    ctx.fillStyle = 'rgba(104, 100, 90, 0.5)';
    ctx.fillRect(-170 + Math.random() * 340, -56 + Math.random() * 112, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const DocumentFolder = ({ onClick, isZooming, onHover, onUnhover }) => {
  const [hovered, setHovered] = useState(false);
  const folderTexture = useMemo(() => makeFolderTexture(), []);
  useCursor(hovered && !isZooming);
  useEffect(() => () => folderTexture.dispose(), [folderTexture]);

  return (
    <group
      position={[1.65, 0.04, 0.65]}
      rotation={[-Math.PI / 2, 0, -0.16]}
      onClick={!isZooming ? onClick : null}
      onPointerOver={() => {
        setHovered(true);
        if (onHover && !isZooming) onHover('document');
      }}
      onPointerOut={() => {
        setHovered(false);
        if (onUnhover) onUnhover();
      }}
    >
      {/* Sombra de contacto suave en la madera */}
      <Plane args={[1.5, 1.95]} position={[0, 0, -0.015]}>
        <meshBasicMaterial color="#000" opacity={0.65} transparent />
      </Plane>

      {/* Contraportada de cartulina */}
      <Box args={[1.32, 1.82, 0.015]} position={[0, 0, 0.008]} castShadow receiveShadow>
        <meshStandardMaterial color="#555249" roughness={0.88} />
      </Box>

      {/* Hojas interiores de papel blanco marfil visibles en los bordes (Foto 4) */}
      <Box args={[1.28, 1.78, 0.03]} position={[0.015, -0.01, 0.024]} receiveShadow>
        <meshStandardMaterial color="#ddd7cb" roughness={0.92} />
      </Box>

      {/* Portada del expediente con el sello CONFIDENTIAL estampado */}
      <Plane args={[1.32, 1.82]} position={[0, 0, 0.042]} receiveShadow castShadow>
        <meshStandardMaterial map={folderTexture} roughness={0.85} />
      </Plane>

      {/* Lomo / solapa izquierda reforzada */}
      <Box args={[0.08, 1.83, 0.044]} position={[-0.65, 0, 0.024]} castShadow>
        <meshStandardMaterial color="#423f37" roughness={0.9} />
      </Box>
    </group>
  );
};



const InteractiveCamera = ({ onClick, isZooming, isActive, onHover, onUnhover }) => {
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF('/assets/models/low_poly_outlast_camera.glb');
  const cameraModel = useMemo(() => scene.clone(true), [scene]);

  // Contorno blanco invertido (Inverted Hull) para silueta 3D nítida en hover
  const outlineModel = useMemo(() => {
    const clone = scene.clone(true);
    const outlineMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      side: THREE.BackSide,
      depthWrite: false,
      transparent: true,
      opacity: 0.95,
    });
    clone.traverse((object) => {
      if (object.isMesh) {
        object.material = outlineMat;
      }
    });
    return clone;
  }, [scene]);

  useCursor(hovered && !isZooming);

  useEffect(() => {
    cameraModel.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
      if (object.material) {
        object.material = object.material.clone();
      }
    });
  }, [cameraModel]);

  // Iluminar los materiales y contornos de la cámara en blanco brillante al pasar el cursor
  useEffect(() => {
    cameraModel.traverse((object) => {
      if (!object.isMesh || !object.material) return;
      if (hovered) {
        object.material.emissive = new THREE.Color('#ffffff');
        object.material.emissiveIntensity = 0.42;
      } else if (isActive) {
        object.material.emissive = new THREE.Color('#0a3a14');
        object.material.emissiveIntensity = 0.25;
      } else {
        object.material.emissive = new THREE.Color('#000000');
        object.material.emissiveIntensity = 0;
      }
    });
  }, [hovered, isActive, cameraModel]);

  return (
    <group
      position={[-4.6, 0.7, -0.7]}
      rotation={[0, 1, 0]}
      scale={5}
      onClick={!isZooming ? onClick : null}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (onHover && !isZooming) onHover('camcorder');
      }}
      onPointerOut={() => {
        setHovered(false);
        if (onUnhover) onUnhover();
      }}
    >
      <Center>
        <group>
          <primitive object={cameraModel} />
          {/* Contorno blanco que bordea el modelo tridimensional */}
          {hovered && !isZooming && (
            <group scale={1.055}>
              <primitive object={outlineModel} />
            </group>
          )}
        </group>
      </Center>

      {/* Luz puntual blanca centrada en la cámara al hacer hover */}
      <pointLight
        position={[0, 0.25, 0]}
        intensity={hovered ? 6 : isActive ? 2 : 0}
        distance={2.4}
        color={hovered ? '#ffffff' : '#22ff77'}
      />

      {/* Rótulo de texto interactivo con resplandor */}
      {hovered && !isZooming && (
        <group position={[0, 0.5, 0]} rotation={[0, -0.9, 0]}>
          <Text fontSize={0.075} color="#ffffff" anchorX="center" anchorY="middle">
            {isActive ? "> [CLIC] DESACTIVAR CÁMARA" : "> [CLIC] ACTIVAR VIDEOCÁMARA"}
          </Text>
        </group>
      )}
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

const FloatingDust = ({ isCamcorderActive = false }) => {
  const dustData = useMemo(() => {
    const count = 220;
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < positions.length; i += 3) {
      const y = -0.5 + Math.random() * 4.6;
      base[i] = (Math.random() - 0.5) * 8.5;
      base[i + 1] = y;
      base[i + 2] = 0.5 + (Math.random() - 0.5) * 6;
      positions[i] = base[i];
      positions[i + 1] = base[i + 1];
      positions[i + 2] = base[i + 2];
      speeds[i / 3] = 0.12 + Math.random() * 0.28;
    }
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(canvas);
    return { positions, base, speeds, sprite };
  }, []);

  const dust = useRef();
  const geometry = useRef();
  const matRef = useRef();

  useFrame(({ clock }) => {
    if (geometry.current) {
      const time = clock.getElapsedTime();
      const positions = geometry.current.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const speed = dustData.speeds[i / 3];
        positions[i] = dustData.base[i] + Math.sin(time * speed + i) * 0.1;
        positions[i + 1] = dustData.base[i + 1] + Math.sin(time * speed * 0.7 + i * 0.3) * 0.16;
        positions[i + 2] = dustData.base[i + 2] + Math.cos(time * speed * 0.8 + i) * 0.08;
      }
      geometry.current.attributes.position.needsUpdate = true;
    }

    if (matRef.current) {
      const targetColor = isCamcorderActive ? new THREE.Color('#78f59d') : new THREE.Color('#c2b48a');
      matRef.current.color.lerp(targetColor, 0.1);
      matRef.current.opacity = isCamcorderActive ? 0.38 : 0.18;
    }
  });

  useEffect(() => () => dustData.sprite.dispose(), [dustData]);

  return (
    <points ref={dust}>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[dustData.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        map={dustData.sprite}
        color="#c2b48a"
        size={0.032}
        transparent
        opacity={0.18}
        alphaTest={0.01}
        depthWrite={false}
        sizeAttenuation
      />
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
  </group>
);

// ---- Camera Controller (Breathing, Fear Tremor, Mouse Look, Dynamic Optical Zoom & 90-degree Turns) ----
const CameraController = ({
  target,
  onReachedTarget,
  isCamcorderActive,
  zoomLevel = 1.0,
  baseYaw = 0
}) => {
  const { camera, clock } = useThree();
  const basePos = new THREE.Vector3(0, 3.5, 4);
  const currentYaw = useRef(0);

  // Usar orden de Euler 'YXZ' para evitar bloqueos de cardán y rotar la cabeza limpiamente
  useEffect(() => {
    camera.rotation.order = 'YXZ';
  }, [camera]);

  useFrame((state) => {
    const time = clock.getElapsedTime();

    // Zoom óptico analógico dinámico: reduce el FOV para ampliar la vista como en Outlast
    const baseFov = 60;
    const targetFov = isCamcorderActive ? baseFov / zoomLevel : baseFov;
    if (Math.abs(camera.fov - targetFov) > 0.02) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.16);
      camera.updateProjectionMatrix();
    }

    if (target === 'none') {
      const targetX = (state.pointer.x * Math.PI) / 5;
      const targetY = (state.pointer.y * Math.PI) / 8 - 0.2;

      // Temblor de pulso nervioso y miedo al sostener la cámara (Outlast handheld camera jitter)
      const tremorX = isCamcorderActive ? (Math.sin(time * 24) * 0.0035 + Math.cos(time * 38) * 0.002) : 0;
      const tremorY = isCamcorderActive ? (Math.cos(time * 20) * 0.0035 + Math.sin(time * 34) * 0.002) : 0;

      // Interpolación suave hacia el nuevo ángulo de 90° (baseYaw)
      currentYaw.current = THREE.MathUtils.lerp(currentYaw.current, baseYaw, 0.08);

      camera.rotation.y = currentYaw.current - targetX + tremorX;
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetY + tremorY, 0.08);

      // Respiración más agitada e irregular en visión nocturna
      const breathIntensity = isCamcorderActive ? 0.065 : 0.04;
      const breathSpeed = isCamcorderActive ? 2.1 : 1.4;
      const breathing = Math.sin(time * breathSpeed) * breathIntensity;

      const targetPos = basePos.clone();
      targetPos.y += breathing;
      camera.position.lerp(targetPos, 0.05);
    }
    else if (target === 'document') {
      currentYaw.current = THREE.MathUtils.lerp(currentYaw.current, 0, 0.1);
      const docPos = new THREE.Vector3(1.5, 1.8, 1.2);
      camera.position.lerp(docPos, 0.08);

      const lookTarget = new THREE.Vector3(1.5, 0, 0.5);
      const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
      currentLookAt.lerp(lookTarget, 0.1);
      camera.lookAt(currentLookAt);

      if (camera.position.distanceTo(docPos) < 0.1) onReachedTarget('document');
    }
    else if (target === 'terminal') {
      currentYaw.current = THREE.MathUtils.lerp(currentYaw.current, 0, 0.1);
      // Cámara centrada perpendicular a la pantalla para que el monitor ocupe ~75% de la vista con el entorno 3D visible
      const monPos = new THREE.Vector3(-1.46, 1.52, 1.66);
      camera.position.lerp(monPos, 0.08);

      const lookTarget = new THREE.Vector3(-1.95, 1.52, -0.74);
      camera.lookAt(lookTarget);

      if (camera.position.distanceTo(monPos) < 0.08) onReachedTarget('terminal');
    }
  });

  return null;
};


// ---- Main Scene Component ----
export default function DesktopScene() {
  const [animatingTo, setAnimatingTo] = useState('none');
  const [activeOverlay, setActiveOverlay] = useState('none');
  const [hoveredItem, setHoveredItem] = useState(null); // 'terminal' | 'document' | 'camcorder' | null
  const [isCamcorderActive, setIsCamcorderActive] = useState(false);
  const [isCameraOnDesk, setIsCameraOnDesk] = useState(true);
  const [isCameraTransitioning, setIsCameraTransitioning] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [baseYaw, setBaseYaw] = useState(0); // Ángulo base de rotación en pasos de 90°
  const [nearEdge, setNearEdge] = useState(null); // 'left' | 'right' | null
  const lastTurnTime = useRef(0);

  const playTurnSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(115, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (err) { }
  };

  const handleTurn = (direction) => {
    if (activeOverlay !== 'none') return;
    const now = Date.now();
    if (now - lastTurnTime.current < 280) return; // Cooldown para evitar giros involuntarios dobles
    lastTurnTime.current = now;

    playTurnSound();
    setBaseYaw((prev) => (direction === 'right' ? prev - Math.PI / 2 : prev + Math.PI / 2));
  };

  const handleOpen = (target) => {
    setAnimatingTo(target);
  };

  const handleClose = () => {
    setActiveOverlay('none');
    setAnimatingTo('none');
  };

  const handleToggleCamcorder = () => {
    if (!isCamcorderActive) {
      // Reproducir el sonido .wav de agarrar la cámara
      try {
        const pickupSound = new Audio('/assets/sounds/camera_pickup.wav');
        pickupSound.volume = 0.95;
        pickupSound.play().catch(() => {});
      } catch (err) {}

      // La cámara física desaparece de la mesa de inmediato al ser agarrada
      setIsCameraOnDesk(false);

      // Activar efecto cinemático de parpadeo a negro de 1 segundo
      setIsCameraTransitioning(true);

      // Activar la visión nocturna en el punto de oscuridad total (400ms)
      setTimeout(() => {
        setIsCamcorderActive(true);
        setZoomLevel(1.0);
      }, 400);

      setTimeout(() => {
        setIsCameraTransitioning(false);
      }, 950);
    } else {
      // Bajar la videocámara (dejar de usar la cámara)
      setIsCameraTransitioning(true);

      // La cámara física reaparece en la mesa y se apaga el modo nocturno ÚNICAMENTE
      // cuando la pantalla está al 100% en negro (450ms), evitando que aparezca antes
      setTimeout(() => {
        setIsCamcorderActive(false);
        setIsCameraOnDesk(true);
        setZoomLevel(1.0);
      }, 450);

      setTimeout(() => {
        setIsCameraTransitioning(false);
      }, 950);
    }
  };

  // Zoom interactivo con la rueda del ratón (Scroll) mientras la videocámara está levantada
  useEffect(() => {
    if (!isCamcorderActive) return;

    const handleWheel = (e) => {
      e.preventDefault();
      setZoomLevel((prev) => {
        const delta = e.deltaY > 0 ? -0.18 : 0.18;
        const next = Math.min(2.8, Math.max(1.0, prev + delta));
        return parseFloat(next.toFixed(2));
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isCamcorderActive]);

  // Detección de límite izquierdo / derecho en la pantalla para activar giros de 90° con clic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (activeOverlay !== 'none') {
        setNearEdge(null);
        return;
      }
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      if (normalizedX > 0.72) {
        setNearEdge('right');
      } else if (normalizedX < -0.72) {
        setNearEdge('left');
      } else {
        setNearEdge(null);
      }
    };

    const handleClick = (e) => {
      if (activeOverlay !== 'none') return;
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      if (normalizedX > 0.72) {
        handleTurn('right');
      } else if (normalizedX < -0.72) {
        handleTurn('left');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [activeOverlay]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        if (activeOverlay !== 'none' || animatingTo === 'terminal') {
          handleClose();
        } else if (isCamcorderActive) {
          handleToggleCamcorder();
        }
      } else if (activeOverlay === 'none' && animatingTo !== 'terminal') {
        // Atajos de teclado para girar 90° libremente
        if (e.key === 'ArrowRight' || e.key === 'e' || e.key === 'E') {
          handleTurn('right');
        } else if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') {
          handleTurn('left');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOverlay, animatingTo, isCamcorderActive]);

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden outlast-cursor">
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 3.5, 4], fov: 60 }}>
          <color attach="background" args={['#020403']} />
          <fog attach="fog" args={['#020403', 2.5, isCamcorderActive ? 18 : 13]} />

          {/* En visión nocturna, las luces ambientales se reducen al mínimo para el contraste terrorífico de Outlast */}
          <ambientLight intensity={isCamcorderActive ? 0.015 : 0.08} color="#16221a" />
          <hemisphereLight args={['#29362c', '#080c09', isCamcorderActive ? 0.02 : 0.22]} />

          {/* Rebote frío y sucio estilo hospital psiquiátrico Mount Massive en modo normal */}
          {!isCamcorderActive && (
            <>
              <pointLight position={[-5, 1.5, -1]} intensity={11} distance={6.5} color="#1c3629" />
              <pointLight position={[-3.8, 1.15, 0.7]} intensity={5} distance={4.5} color="#1d3628" />
            </>
          )}

          {/* Linterna Infrarroja (IR Spotlight) que ilumina hacia donde mira el jugador con zoom dinámico */}
          <CamcorderIRSpotlight active={isCamcorderActive} zoom={zoomLevel} />

          <Room isCamcorderActive={isCamcorderActive} />
          <Suspense fallback={null}>
            <Desk />
            <Monitor
              onClick={() => handleOpen('terminal')}
              isZooming={animatingTo !== 'none'}
              isScreenActive={animatingTo === 'terminal' || activeOverlay === 'terminal'}
              onClose={handleClose}
              onHover={setHoveredItem}
              onUnhover={() => setHoveredItem(null)}
            />
            <DocumentFolder
              onClick={() => handleOpen('document')}
              isZooming={animatingTo !== 'none'}
              onHover={setHoveredItem}
              onUnhover={() => setHoveredItem(null)}
            />
            {/* La cámara desaparece al agarrarla y solo reaparece en la mesa cuando la pantalla está completamente en negro */}
            {isCameraOnDesk && (
              <InteractiveCamera
                onClick={handleToggleCamcorder}
                isZooming={animatingTo !== 'none'}
                isActive={isCamcorderActive}
                onHover={setHoveredItem}
                onUnhover={() => setHoveredItem(null)}
              />
            )}
            <Clutter />
          </Suspense>
          <FloatingDust isCamcorderActive={isCamcorderActive} />

          <CameraController
            target={animatingTo}
            isCamcorderActive={isCamcorderActive}
            zoomLevel={zoomLevel}
            baseYaw={baseYaw}
            onReachedTarget={(target) => {
              if (activeOverlay !== target) setActiveOverlay(target);
            }}
          />

        </Canvas>
      </div>

      {/* Indicadores visuales interactivos de giro de 90° al llegar al límite de la pantalla */}
      {activeOverlay === 'none' && animatingTo !== 'terminal' && (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleTurn('left');
            }}
            className={`fixed left-0 top-0 bottom-0 w-28 z-30 flex items-center justify-start pl-4 pointer-events-auto transition-all duration-300 cursor-w-resize select-none ${nearEdge === 'left' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
              }`}
            title="Clic para girar 90° a la izquierda (o pulsa Q / ◀)"
          >
            <div className="bg-black/85 border border-[#3dff84]/50 text-[#3dff84] px-3.5 py-2 rounded-sm text-xs font-mono tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(61,255,132,0.4)] backdrop-blur-sm animate-pulse">
              <span className="text-base font-bold">◀</span>
              <span className="hidden sm:inline">GIRAR 90°</span>
            </div>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              handleTurn('right');
            }}
            className={`fixed right-0 top-0 bottom-0 w-28 z-30 flex items-center justify-end pr-4 pointer-events-auto transition-all duration-300 cursor-e-resize select-none ${nearEdge === 'right' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
              }`}
            title="Clic para girar 90° a la derecha (o pulsa E / ▶)"
          >
            <div className="bg-black/85 border border-[#3dff84]/50 text-[#3dff84] px-3.5 py-2 rounded-sm text-xs font-mono tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(61,255,132,0.4)] backdrop-blur-sm animate-pulse">
              <span className="hidden sm:inline">GIRAR 90°</span>
              <span className="text-base font-bold">▶</span>
            </div>
          </div>
        </>
      )}

      {/* Transición cinemática de parpadeo a negro (1 segundo) al agarrar la cámara */}
      {isCameraTransitioning && (
        <div className="fixed inset-0 z-50 bg-black pointer-events-none animate-camera-blink" />
      )}

      {/* Visión Nocturna y HUD de Videocámara Outlast (100% fiel a la referencia) */}
      <OutlastCamcorderOverlay
        isActive={isCamcorderActive}
        onToggleActive={handleToggleCamcorder}
        zoom={zoomLevel}
        onZoomChange={setZoomLevel}
        isDocumentOrTerminalOpen={activeOverlay !== 'none' || animatingTo === 'terminal'}
      />

      {/* In-Game HUD Interaction Prompt (Foto 4: "Pulsa (BOTÓN IZQUIERDO DEL RATÓN) para coger Documento", etc.) */}
      {hoveredItem && animatingTo === 'none' && activeOverlay === 'none' && (
        <div className="fixed bottom-10 left-0 right-0 z-30 flex justify-center pointer-events-none select-none animate-in fade-in duration-200">
          <div className="bg-black/75 border border-white/20 text-[#eaeaea] px-6 py-2 rounded-xs font-typewriter text-xs sm:text-sm tracking-wider shadow-[0_4px_30px_rgba(0,0,0,0.95)] backdrop-blur-sm flex items-center gap-2">
            <span>Pulsa</span>
            <span className="text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              (BOTÓN IZQUIERDO DEL RATÓN)
            </span>
            <span>
              para{' '}
              {hoveredItem === 'document'
                ? 'coger Documento'
                : hoveredItem === 'camcorder'
                ? 'coger Videocámara'
                : 'usar Terminal'}
            </span>
          </div>
        </div>
      )}

      {/* Botón flotante para alejarse del monitor y volver a la vista del escritorio */}
      {(animatingTo === 'terminal' || activeOverlay === 'terminal') && (
        <div className="fixed top-5 right-5 z-40 animate-in fade-in duration-300 pointer-events-auto">
          <button
            onClick={handleClose}
            className="bg-black/90 hover:bg-[#8a0303] text-white border border-[#3b5998] hover:border-red-500 px-4 py-2.5 rounded shadow-2xl font-mono text-xs tracking-widest uppercase flex items-center gap-2 cursor-pointer transition-all duration-200 backdrop-blur-md group"
            title="Alejarse de la pantalla (o presiona ESC)"
          >
            <span className="text-sm font-bold text-blue-300 group-hover:text-white">✕</span>
            <span>ALEJARSE DEL MONITOR (ESC)</span>
          </button>
        </div>
      )}

      {/* Overlays */}
      {activeOverlay === 'document' && <OutlastDocumentOverlay onClose={handleClose} />}
    </div>
  );
}

useGLTF.preload('/assets/models/keyboard.glb');
useGLTF.preload('/assets/models/low_poly_outlast_camera.glb');
useGLTF.preload('/assets/models/skeleton.glb');
