/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { forwardRef, useRef, useMemo, useLayoutEffect } from 'react'
import { Color, Mesh, ShaderMaterial } from 'three'

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  hex = hex.replace('#', '')
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
  ]
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  vec3 paperColor = vec3(0.996, 0.992, 0.968); // #FFFDF7
  
  // Rotate and scale coordinates
  vec2 uv = rotateUvs(vUv - 0.5, uRotation + 0.05 * sin(uTime * 0.2));
  
  // Grid layout
  vec2 grid = fract(uv * 32.0 * uScale) - 0.5;
  float dist = length(grid);
  
  // Dot radius varies across the screen and over time
  float val = sin(vUv.x * 6.0 + uTime * uSpeed * 0.05) * cos(vUv.y * 6.0 + uTime * uSpeed * 0.05);
  float targetRadius = 0.15 + 0.12 * (0.5 + 0.5 * val);
  
  // Antialiased dots
  float dots = smoothstep(targetRadius + 0.03, targetRadius - 0.03, dist);
  
  // Mix paper color and the dynamic chapter color
  vec3 finalCol = mix(paperColor, uColor, dots * 0.25);
  
  gl_FragColor = vec4(finalCol, 1.0);
}
`

interface SilkPlaneProps {
  uniforms: {
    uSpeed: { value: number }
    uScale: { value: number }
    uNoiseIntensity: { value: number }
    uColor: { value: Color }
    uRotation: { value: number }
    uTime: { value: number }
  }
}

const SilkPlane = forwardRef<Mesh, SilkPlaneProps>(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree()
  const localRef = useRef<Mesh>(null)
  const actualRef = (ref || localRef) as React.MutableRefObject<Mesh | null>

  useLayoutEffect(() => {
    if (actualRef.current) {
      actualRef.current.scale.set(viewport.width, viewport.height, 1)
    }
  }, [actualRef, viewport])

  useFrame((_, delta) => {
    if (actualRef.current) {
      const material = actualRef.current.material as ShaderMaterial
      material.uniforms.uTime.value += 0.1 * delta
    }
  })

  return (
    <mesh ref={actualRef}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  )
})
SilkPlane.displayName = 'SilkPlane'

interface SilkProps {
  speed?: number
  scale?: number
  color?: string
  noiseIntensity?: number
  rotation?: number
}

export const Silk = ({ 
  speed = 5, 
  scale = 1, 
  color = '#7B7481', 
  noiseIntensity = 1.5, 
  rotation = 0 
}: SilkProps) => {
  const meshRef = useRef<Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 }
    }),
    [speed, scale, noiseIntensity, color, rotation]
  )

  return (
    <Canvas dpr={1} frameloop="always">
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  )
}

export default Silk
