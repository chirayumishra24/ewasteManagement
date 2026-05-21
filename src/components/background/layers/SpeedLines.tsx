import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SpeedLines() {
  const count = 120;
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Generate points in a cylinder pointing towards the camera
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = -30 + Math.random() * 30; // Z position
      sp[i] = 15 + Math.random() * 20; // Fast speed
    }
    return [pos, sp];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posArr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 2] += speeds[i] * delta;
      if (posArr[i * 3 + 2] > 10) {
        posArr[i * 3 + 2] = -30; // recycle back
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#1A1A2E"
        size={0.15}
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default SpeedLines;
