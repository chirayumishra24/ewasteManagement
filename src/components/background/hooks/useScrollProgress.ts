import { useEffect, useState } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const maxScroll = scrollHeight - clientHeight
      
      if (maxScroll <= 0) {
        setProgress(0)
        return
      }

      const currentProgress = window.scrollY / maxScroll
      setProgress(Math.min(Math.max(currentProgress, 0), 1))
    }

    // Initial check
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progress
}
