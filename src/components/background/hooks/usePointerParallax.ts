import { useEffect, useRef, useState } from 'react'
import { MathUtils } from 'three'

export function usePointerParallax(strength = 0.05, lerpFactor = 0.05, enabled = true) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const targetPointer = useRef({ x: 0, y: 0 })
  const currentPointer = useRef({ x: 0, y: 0 })
  const requestRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      targetPointer.current = { x: 0, y: 0 }
      currentPointer.current = { x: 0, y: 0 }
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      // Normalize to -1 to 1
      targetPointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      targetPointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const animate = () => {
      currentPointer.current.x = MathUtils.lerp(
        currentPointer.current.x,
        targetPointer.current.x * strength,
        lerpFactor
      )
      currentPointer.current.y = MathUtils.lerp(
        currentPointer.current.y,
        targetPointer.current.y * strength,
        lerpFactor
      )

      setPointer({ x: currentPointer.current.x, y: currentPointer.current.y })
      requestRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', onPointerMove)
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [strength, lerpFactor, enabled])

  return enabled ? pointer : { x: 0, y: 0 }
}
