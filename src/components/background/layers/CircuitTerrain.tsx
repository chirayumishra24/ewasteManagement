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
  void main() {
    vec2 uv = vUv * 40.0;
    
    // Industrial floor noise (concrete feel)
    float n = fract(sin(dot(floor(uv * 10.0), vec2(12.9898, 78.233))) * 43758.5453);
    vec3 base = mix(uBaseColor, uBaseColor * 0.8, n * 0.2);
    
    // Subtle grid lines
    vec2 p = fract(uv) - 0.5;
    float grid = smoothstep(0.01, 0.0, min(abs(p.x), abs(p.y)) - 0.02);
    float tracePulse = 0.55 + sin(uTime * 0.6 + vUv.x * 18.0) * 0.18;
    
    // Hazard stripes near center (where conveyor is)
    float hazardArea = smoothstep(0.12, 0.1, abs(vUv.y - 0.5));
    float stripes = step(0.5, fract(vUv.x * 20.0 + vUv.y * 20.0));
    vec3 hazardColor = mix(vec3(0.49, 0.42, 0.3), vec3(0.89, 0.63, 0.16), stripes);
    
    vec3 color = mix(base, uTraceColor, grid * (0.08 + uScroll * 0.08) * tracePulse);
    color = mix(color, hazardColor, hazardArea * (0.24 + (1.0 - uScroll) * 0.16));
    
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
