import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

interface DebrisItem {
  id: number;
  type: 'phone' | 'battery' | 'board' | 'chip';
  position: [number, number, number];
  rotation: [number, number, number];
  rotSpeed: [number, number, number];
  scale: [number, number, number];
  color: string;
}

export function ComicDebris() {
  const groupRef = useRef<THREE.Group>(null);

  const items = useMemo(() => {
    const arr: DebrisItem[] = [];
    const types: ('phone' | 'battery' | 'board' | 'chip')[] = ['phone', 'battery', 'board', 'chip'];
    const colors = [
      '#1E40AF', // hero-blue
      '#15803D', // hero-green
      '#EA580C', // villain-orange
      '#B91C1C', // villain-red
      '#7C3AED', // villain-purple
      '#FACC15', // pow-yellow
    ];

    for (let i = 0; i < 25; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 8;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      const z = -10 - Math.random() * 15;

      arr.push({
        id: i,
        type: types[i % types.length],
        position: [x, y, z],
        rotation: [Math.random() * 5, Math.random() * 5, Math.random() * 5],
        rotSpeed: [
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
        ],
        scale: [0.6 + Math.random() * 0.5, 0.6 + Math.random() * 0.5, 0.6 + Math.random() * 0.5],
        color: colors[i % colors.length],
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Float the entire group gently
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.25;

    // Rotate individual meshes
    const children = groupRef.current.children;
    items.forEach((item, idx) => {
      const mesh = children[idx];
      if (mesh) {
        mesh.rotation.x += item.rotSpeed[0] * delta;
        mesh.rotation.y += item.rotSpeed[1] * delta;
        mesh.rotation.z += item.rotSpeed[2] * delta;
      }
    });
  });

  const renderGeometry = (type: DebrisItem['type']) => {
    switch (type) {
      case 'phone':
        return <boxGeometry args={[0.8, 1.4, 0.15]} />;
      case 'battery':
        return <cylinderGeometry args={[0.3, 0.3, 1.0, 8]} />;
      case 'board':
        return <boxGeometry args={[1.2, 0.8, 0.08]} />;
      case 'chip':
      default:
        return <boxGeometry args={[0.6, 0.6, 0.3]} />;
    }
  };

  return (
    <group ref={groupRef}>
      {items.map((item) => (
        <mesh
          key={item.id}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
        >
          {renderGeometry(item.type)}
          <meshBasicMaterial color={item.color} toneMapped={false} />
          <Edges color="#1A1A2E" threshold={15} lineWidth={2.0} />
        </mesh>
      ))}
    </group>
  );
}

export default ComicDebris;
