import { Suspense, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import ErrorBoundary from '../ErrorBoundary';
import GlobeFallback from './GlobeFallback';

const DESTINATIONS = [
  { name: 'Manali', lat: 32.24, lon: 77.19, note: 'Mountain air · 76% match' },
  { name: 'Jaipur', lat: 26.91, lon: 75.79, note: 'Slow streets · 79% match' },
  { name: 'Hampi', lat: 15.33, lon: 76.46, note: 'Ancient trails · 82% match' },
  { name: 'Goa', lat: 15.49, lon: 73.82, note: 'Open coast · 87% match' },
];

const ROUTES = [
  ['Manali', 'Goa'],
  ['Jaipur', 'Hampi'],
  ['Hyderabad', 'Goa'],
];

const toPoint = (lat, lon, radius = 1.82) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

const destinationByName = Object.fromEntries(DESTINATIONS.map((destination) => [destination.name, destination]));

const arcPoints = (from, to) => {
  const start = toPoint(from.lat, from.lon);
  const end = toPoint(to.lat, to.lon);
  const points = [];
  for (let index = 0; index <= 32; index += 1) {
    const progress = index / 32;
    const point = start.clone().lerp(end, progress).normalize().multiplyScalar(1.82 + Math.sin(progress * Math.PI) * 0.28);
    points.push(point);
  }
  return points;
};

const Marker = ({ destination, reducedMotion }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const position = useMemo(() => toPoint(destination.lat, destination.lon, 1.88), [destination]);

  return (
    <group position={position}>
      <mesh
        onClick={(event) => { event.stopPropagation(); navigate(`/discover?destination=${encodeURIComponent(destination.name)}`); }}
        onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.55 : 1}
      >
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#e87952" />
      </mesh>
      <mesh scale={hovered ? 1.8 : 1}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#e87952" transparent opacity={hovered ? 0.24 : 0.12} />
      </mesh>
      {hovered && (
        <Html distanceFactor={5} position={[0.08, 0.08, 0]} center>
          <button
            type="button"
            className="min-w-[145px] rounded-xl border border-white/15 bg-[#102d29]/90 px-3 py-2 text-left text-white shadow-xl backdrop-blur-md"
            onClick={() => navigate(`/discover?destination=${encodeURIComponent(destination.name)}`)}
          >
            <span className="block text-[10px] font-bold uppercase tracking-[.14em] text-[#a9d6d2]">Explore route</span>
            <span className="mt-1 block font-display text-base">{destination.name}</span>
            <span className="mt-1 block text-[10px] text-white/60">{destination.note}</span>
          </button>
        </Html>
      )}
      {!reducedMotion && !hovered && <pointLight color="#e87952" intensity={0.18} distance={0.8} />}
    </group>
  );
};

const GlobeObject = ({ reducedMotion }) => {
  const globeRef = useRef(null);

  useFrame((_, delta) => {
    if (globeRef.current && !reducedMotion) globeRef.current.rotation.y += delta * 0.055;
  });

  return (
    <group ref={globeRef} rotation={[0.12, -0.48, 0]}>
      <mesh>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial color="#17463e" roughness={0.86} metalness={0.04} />
      </mesh>
      <mesh scale={1.035}>
        <sphereGeometry args={[1.8, 48, 48]} />
        <meshBasicMaterial color="#8fcac1" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.81, 0.008, 8, 96]} />
        <meshBasicMaterial color="#a9d6d2" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[0.2, 0.4, 0.8]}>
        <torusGeometry args={[1.81, 0.008, 8, 96]} />
        <meshBasicMaterial color="#a9d6d2" transparent opacity={0.23} />
      </mesh>
      {ROUTES.map(([fromName, toName]) => {
        const from = fromName === 'Hyderabad' ? { lat: 17.38, lon: 78.48 } : destinationByName[fromName];
        const to = destinationByName[toName];
        const points = arcPoints(from, to);
        return (
          <line key={`${fromName}-${toName}`}>
            <bufferGeometry attach="geometry" onUpdate={(geometry) => geometry.setFromPoints(points)} />
            <lineBasicMaterial color="#e87952" transparent opacity={0.58} linewidth={1} />
          </line>
        );
      })}
      {DESTINATIONS.map((destination) => <Marker key={destination.name} destination={destination} reducedMotion={reducedMotion} />)}
    </group>
  );
};

class SceneErrorBoundary extends ErrorBoundary {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const TravelGlobe = ({ reducedMotion: reducedMotionProp }) => {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = reducedMotionProp ?? prefersReducedMotion;

  return (
  <SceneErrorBoundary fallback={<GlobeFallback />}>
    <div className="relative aspect-square w-full" aria-label="Interactive TravelMate route globe" role="img">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 36 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={1.7} color="#d7eee8" />
          <directionalLight position={[4, 4, 5]} intensity={3.4} color="#fff7e8" />
          <directionalLight position={[-4, -2, -3]} intensity={1.2} color="#91c8be" />
          <GlobeObject reducedMotion={reducedMotion} />
          <Stars radius={8} depth={5} count={reducedMotion ? 80 : 180} factor={1.2} saturation={0} fade speed={reducedMotion ? 0 : 0.18} />
          <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} rotateSpeed={0.35} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute left-[3%] top-[13%] rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Starting from</p>
        <p className="mt-1 font-display text-lg">Hyderabad</p>
      </div>
      <div className="pointer-events-none absolute bottom-[9%] right-0 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Tap a marker</p>
        <p className="mt-1 font-display text-lg">Find your route</p>
      </div>
    </div>
  </SceneErrorBoundary>
  );
};

export default TravelGlobe;
