import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, ShaderMaterial } from 'three'
import { sceneConfig } from '../../../sceneConfig'

const vertexShader = `
  precision mediump float;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision mediump float;
  uniform float uScroll;
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uTraceColor;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv * 60.0;
    
    // Playful meadow texture (soft color variation)
    float n = random(floor(uv));
    vec3 base = mix(uBaseColor, uBaseColor * 0.95, n);
    
    // Subtle waving grass effect
    float wave = sin(uv.x * 0.5 + uTime * 0.4) * cos(uv.y * 0.5 + uTime * 0.3);
    base = mix(base, base * 1.05, wave * 0.1);
    
    // Soft "flower" spots
    float flower = smoothstep(0.48, 0.5, random(floor(uv * 0.5)));
    vec3 flowerColor = mix(vec3(1.0, 0.85, 0.24), vec3(1.0, 0.42, 0.62), random(floor(uv * 0.5)));
    
    vec3 color = mix(base, flowerColor, flower * 0.08);
    
    // Fade out towards edges
    float dist = distance(vUv, vec2(0.5));
    color = mix(color, vec3(1.0), smoothstep(0.3, 0.5, dist));
    
    gl_FragColor = vec4(color, 1.0);
  }
`

export function CircuitTerrain({ scrollProgress }: { scrollProgress: number }) {
  const materialRef = useRef<ShaderMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uScroll.value = scrollProgress
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uBaseColor: { value: new Color(sceneConfig.colors.terrainBase) },
          uTraceColor: { value: new Color(sceneConfig.colors.terrainTrace) },
        }}
      />
    </mesh>
  )
}
