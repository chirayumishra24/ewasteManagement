import { Html } from '@react-three/drei'

interface HUDProps {
  title: string
  score?: number
  message?: string
  hint?: string
}

export default function HUD({ title, score, message, hint }: HUDProps) {
  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 font-sans text-white">
        <div className="flex justify-between items-start">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl">
            <h2 className="text-xs uppercase tracking-[0.2em] text-blue-400 font-bold mb-1">{title}</h2>
            {message && <p className="text-lg font-medium">{message}</p>}
          </div>
          
          {score !== undefined && (
            <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl text-right">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Recovery Data</p>
              <p className="text-3xl font-mono font-bold text-green-400">{score.toString().padStart(4, '0')}</p>
            </div>
          )}
        </div>

        {hint && (
          <div className="self-center mb-8 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 px-6 py-3 rounded-full animate-pulse">
            <p className="text-sm font-medium text-blue-300">💡 {hint}</p>
          </div>
        )}
      </div>
    </Html>
  )
}
