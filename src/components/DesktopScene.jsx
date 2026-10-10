import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Plane, Text, useCursor, RoundedBox, useGLTF, useTexture, Center } from '@react-three/drei';
import * as THREE from 'three';
import InvestigationFiles from './InvestigationFiles.jsx';
import OutlastCamcorderOverlay from './OutlastCamcorderOverlay.jsx';

// ---- 3D Models & Enclosed Asylum Office ----
const AsylumDoor = () => (
  <group position={[6.2, -0.7, -5.14]}>
    {/* Marco metálico de la puerta */}
    <Box args={[2.6, 4.8, 0.22]} position={[0, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#141816" roughness={0.7} metalness={0.6} />
    </Box>
    {/* Hoja de la puerta de madera maciza hospitalaria */}
    <Box args={[2.24, 4.48, 0.12]} position={[0, -0.05, 0.05]} castShadow receiveShadow>
      <meshStandardMaterial color="#2c221a" roughness={0.85} metalness={0.1} />
    </Box>
    {/* Plancha de protección de acero en la parte inferior */}
    <Box args={[2.2, 0.8, 0.14]} position={[0, -1.8, 0.06]} castShadow receiveShadow>
      <meshStandardMaterial color="#3a3d3a" roughness={0.5} metalness={0.8} />
    </Box>
    {/* Ventana de observación rectangular con barras */}
    <group position={[0, 0.9, 0.06]}>
      <Box args={[0.7, 1.1, 0.14]}>
        <meshStandardMaterial color="#0b0e0c" roughness={0.4} />
      </Box>
      {/* Cristal reforzado esmerilado */}
      <Plane args={[0.54, 0.94]} position={[0, 0, 0.08]}>
        <meshStandardMaterial color="#2d4251" roughness={0.3} metalness={0.4} transparent opacity={0.85} />
      </Plane>
      {/* Barrotes de seguridad */}
      {[-0.15, 0, 0.15].map((x, i) => (
        <Box key={i} args={[0.025, 0.94, 0.03]} position={[x, 0, 0.1]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.3} />
        </Box>
      ))}
    </group>
    {/* Manija pesada y cerradura */}
    <Box args={[0.08, 0.35, 0.16]} position={[-0.88, -0.1, 0.12]} castShadow>
      <meshStandardMaterial color="#a0a5a0" metalness={0.85} roughness={0.35} />
    </Box>
    {/* Letrero institucional de Murkoff */}
    <Plane args={[1.6, 0.28]} position={[0, 2.15, 0.12]}>
      <meshStandardMaterial color="#0c0e0c" roughness={0.5} />
    </Plane>
    <Text position={[0, 2.15, 0.13]} fontSize={0.09} color="#e6dec8">
      PABELLÓN D // CONSULTA 04
    </Text>
    {/* Haz frío de luz que se filtra por debajo y por la mirilla desde el pasillo exterior del pabellón */}
    <pointLight position={[0, -2.1, 0.4]} intensity={4.5} distance={3.8} color="#1d4d3d" />
    <pointLight position={[0, 0.9, 0.3]} intensity={2.4} distance={2.5} color="#5e1212" />
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
    {/* Mensaje central icónico en la pared del fondo sobre el escritorio (estilo Padre Martin / pacientes) */}
    <group position={[-1.2, 3.8, -5.14]}>
      <Text
        font="/assets/fonts/Nosifer.ttf"
        fontSize={0.42}
        color="#450505"
        letterSpacing={0.06}
        anchorX="center"
        anchorY="middle"
      >
        EL WALRIDER NOS OBSERVA
      </Text>
      {/* Chorretones de sangre escurriendo por la pared como dedos arrastrados */}
      {[-2.4, -1.8, -1.1, -0.4, 0.3, 0.9, 1.7, 2.2].map((x, i) => (
        <Box key={i} args={[0.018 + (i % 3) * 0.008, 0.5 + (i % 4) * 0.28, 0.005]} position={[x, -0.42 - (i % 3) * 0.1, 0.005]}>
          <meshStandardMaterial color="#320303" roughness={0.7} opacity={0.88} transparent />
        </Box>
      ))}
    </group>

    {/* Mensaje en la pared lateral izquierda junto al conducto de ventilación */}
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
        PURIFICACION POR SANGRE
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
        MURKOFF MIENTE // TERAPIA MORFOGENICA
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

const PsychiatricMedsDebris = () => (
  <group>
    {/* Frasco de sedantes psiquiátricos volcado sobre la mesa */}
    <group position={[0.95, 0.1, 0.85]} rotation={[0, 0.35, Math.PI / 2]}>
      {/* Frasco translúcido ámbar */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.22, 16]} />
        <meshStandardMaterial color="#8a4f15" roughness={0.3} metalness={0.1} transparent opacity={0.78} />
      </mesh>
      {/* Tapón blanco de seguridad */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.082, 0.082, 0.04, 16]} />
        <meshStandardMaterial color="#ddd9ce" roughness={0.4} />
      </mesh>
      {/* Etiqueta rasgada de Murkoff Pharmaceuticals */}
      <mesh position={[0, -0.01, 0]}>
        <cylinderGeometry args={[0.076, 0.076, 0.14, 16, 1, true, 0, Math.PI * 1.5]} />
        <meshStandardMaterial color="#ded7bf" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>

    {/* Pastillas y cápsulas blancas desparramadas sobre la mesa de madera */}
    {[
      [0.82, 0.08, 0.68], [0.72, 0.08, 0.82], [1.14, 0.08, 0.95],
      [0.65, 0.08, 0.98], [0.88, 0.08, 1.1]
    ].map(([x, y, z], i) => (
      <mesh key={i} position={[x, y, z]} castShadow>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial color="#f0ede1" roughness={0.5} />
      </mesh>
    ))}

    {/* Bandeja metálica quirúrgica con instrumental clínico oxidado */}
    <group position={[2.9, 0.08, 1.25]} rotation={[0, -0.22, 0]}>
      <RoundedBox args={[0.78, 0.04, 0.44]} radius={0.02} smoothness={2} castShadow receiveShadow>
        <meshStandardMaterial color="#2d3330" roughness={0.45} metalness={0.75} />
      </RoundedBox>
      {/* Mancha de sangre seca dentro de la bandeja */}
      <Plane args={[0.4, 0.22]} rotation={[-Math.PI / 2, 0, 0.2]} position={[0, 0.022, 0]}>
        <meshBasicMaterial color="#350404" transparent opacity={0.7} />
      </Plane>
      {/* Bisturí / pinzas de metal */}
      <Box args={[0.32, 0.012, 0.025]} position={[-0.1, 0.028, 0.04]} rotation={[0, 0.15, 0]} castShadow>
        <meshStandardMaterial color="#9ea3a0" metalness={0.9} roughness={0.2} />
      </Box>
    </group>
  </group>
);

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

    {/* Pared Frontal con suciedad acumulada */}
    <Plane args={[20, 9.4]} position={[0, 0.6, -5.2]} receiveShadow>
      <meshStandardMaterial color="#0f1512" roughness={0.9} />
    </Plane>
    {/* Zócalo pared frontal */}
    <Box args={[20, 0.35, 0.1]} position={[0, -3.85, -5.15]} receiveShadow>
      <meshStandardMaterial color="#070908" roughness={0.7} metalness={0.3} />
    </Box>

    {/* Pared Trasera */}
    <Plane args={[20, 9.4]} rotation={[0, Math.PI, 0]} position={[0, 0.6, 7.5]} receiveShadow>
      <meshStandardMaterial color="#0c100e" roughness={0.92} />
    </Plane>
    <Box args={[20, 0.35, 0.1]} position={[0, -3.85, 7.45]} receiveShadow>
      <meshStandardMaterial color="#070908" roughness={0.7} metalness={0.3} />
    </Box>

    {/* Pared Izquierda */}
    <Plane args={[14, 9.4]} rotation={[0, Math.PI / 2, 0]} position={[-9.5, 0.6, 1.2]} receiveShadow>
      <meshStandardMaterial color="#0e1310" roughness={0.9} />
    </Plane>
    <Box args={[0.1, 0.35, 14]} position={[-9.45, -3.85, 1.2]} receiveShadow>
      <meshStandardMaterial color="#070908" roughness={0.7} metalness={0.3} />
    </Box>

    {/* Pared Derecha */}
    <Plane args={[14, 9.4]} rotation={[0, -Math.PI / 2, 0]} position={[9.5, 0.6, 1.2]} receiveShadow>
      <meshStandardMaterial color="#0e1310" roughness={0.9} />
    </Plane>
    <Box args={[0.1, 0.35, 14]} position={[9.45, -3.85, 1.2]} receiveShadow>
      <meshStandardMaterial color="#070908" roughness={0.7} metalness={0.3} />
    </Box>

    {/* Rótulo de SALIDA iluminado en rojo sobre la puerta pesada */}
    <AsylumExitSign position={[6.2, 1.95, -5.12]} />

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
  const woodTexture = useMemo(() => makeTexture('wood'), []);
  useEffect(() => () => woodTexture.dispose(), [woodTexture]);

  return (
    <group>
      {/* Tabla de madera pesada, con canto y patas visibles en la penumbra */}
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
      <DeskScratches />
      {/* Salpicaduras PNG del paquete aportado, situadas en varias zonas de la cubierta. */}
      <BloodTextureStain file="bloodslash_heavy.png" position={[0.25, 0.081, 1.68]} rotation={-0.16} size={[3.05, 1.72]} opacity={0.62} />
      <BloodTextureStain file="bloodspray.png" position={[-3.75, 0.081, -0.52]} rotation={0.48} size={[2.2, 1.24]} opacity={0.56} />
      <BloodTextureStain file="bloodsplat.png" position={[4.05, 0.081, -1.4]} rotation={-0.1} size={[2.15, 1.2]} opacity={0.6} />
      <BloodTextureStain file="bloodslash2.png" position={[4.65, 0.081, 1.42]} rotation={0.62} size={[1.7, 0.96]} opacity={0.58} />
      {/* Atrezo psiquiátrico de Mount Massive: frasco de sedantes volcado, pastillas y bandeja clínica */}
      <PsychiatricMedsDebris />
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
  const nextFailure = useRef(3.5);
  const failureEnds = useRef(0);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (time > nextFailure.current) {
      failureEnds.current = time + 0.08 + Math.random() * 0.24;
      nextFailure.current = time + 3.5 + Math.random() * 7;
    }
    const failing = time < failureEnds.current;
    // Caída violenta de tensión y micro-parpadeo sucio de lámpara hospitalaria
    const flutter = failing ? (Math.sin(time * 110) > 0.08 ? 0.12 : 0.48) : 1;
    const naturalVariation = 0.94 + Math.sin(time * 2.1) * 0.035;
    if (light.current) {
      light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, 980 * flutter * naturalVariation, 0.2);
    }
  });

  return (
    <group>
      {/* Bombilla incandescente sucia de filamento con luz amarillenta-verdosa amortiguada */}
      <spotLight
        ref={light}
        position={[0.6, 5, 1.4]}
        angle={0.75}
        penumbra={0.78}
        intensity={980}
        color="#baa05b"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
        decay={2}
        distance={16}
      />
      <pointLight position={[0.6, 4.72, 1.4]} intensity={7.5} distance={3} color="#948245" />
      <mesh position={[0.6, 4.7, 1.4]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#bfa767" />
      </mesh>
    </group>
  );
};



const InteractiveCamera = ({ onClick, isZooming, isActive }) => {
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
      }}
      onPointerOut={() => setHovered(false)}
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
        if (activeOverlay !== 'none') {
          handleClose();
        } else if (isCamcorderActive) {
          handleToggleCamcorder();
        }
      } else if (activeOverlay === 'none') {
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
  }, [activeOverlay, isCamcorderActive]);

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden cursor-crosshair">
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 3.5, 4], fov: 60 }}>
          <color attach="background" args={['#020403']} />
          <fog attach="fog" args={['#020403', 2.5, isCamcorderActive ? 18 : 13]} />

          {/* En visión nocturna, las luces ambientales se reducen al mínimo para el contraste terrorífico de Outlast */}
          <ambientLight intensity={isCamcorderActive ? 0.015 : 0.08} color="#16221a" />
          <hemisphereLight args={['#29362c', '#080c09', isCamcorderActive ? 0.02 : 0.22]} />
          {!isCamcorderActive && <UnstableDeskLight />}

          {/* Rebote sucio y frío estilo hospital psiquiátrico Mount Massive en modo normal */}
          {!isCamcorderActive && (
            <>
              <pointLight position={[-5, 1.5, -1]} intensity={11} distance={6.5} color="#1c3629" />
              <pointLight position={[-3.8, 1.15, 0.7]} intensity={12} distance={4.5} color="#8a7947" />
            </>
          )}

          {/* Linterna Infrarroja (IR Spotlight) que ilumina hacia donde mira el jugador con zoom dinámico */}
          <CamcorderIRSpotlight active={isCamcorderActive} zoom={zoomLevel} />

          <Room isCamcorderActive={isCamcorderActive} />
          <Suspense fallback={null}>
            <Desk />
            <Monitor onClick={() => handleOpen('terminal')} isZooming={animatingTo !== 'none'} />
            <DocumentFolder onClick={() => handleOpen('document')} isZooming={animatingTo !== 'none'} />
            {/* La cámara desaparece al agarrarla y solo reaparece en la mesa cuando la pantalla está completamente en negro */}
            {isCameraOnDesk && (
              <InteractiveCamera
                onClick={handleToggleCamcorder}
                isZooming={animatingTo !== 'none'}
                isActive={isCamcorderActive}
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
      {activeOverlay === 'none' && (
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
        isDocumentOrTerminalOpen={activeOverlay !== 'none'}
      />

      {/* Overlays */}
      {activeOverlay === 'document' && <DocumentOverlay onClose={handleClose} />}
      {activeOverlay === 'terminal' && <TerminalOverlay onClose={handleClose} />}
    </div>
  );
}

useGLTF.preload('/assets/models/keyboard.glb');
useGLTF.preload('/assets/models/low_poly_outlast_camera.glb');
useGLTF.preload('/assets/models/skeleton.glb');
