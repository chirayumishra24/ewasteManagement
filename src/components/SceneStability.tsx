import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SceneErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("3D Scene Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <ScenePlaceholder />;
    }

    return this.props.children;
  }
}

export function ScenePlaceholder({ message = "3D Simulation Unavailable" }: { message?: string }) {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-md rounded-2xl border-2 border-white/10 p-8 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl mb-4 border border-white/10 animate-pulse">
        📦
      </div>
      <h4 className="text-white font-fredoka font-bold text-lg mb-2">{message}</h4>
      <p className="text-white/60 text-sm max-w-[250px]">
        This simulation requires WebGL. Try reloading or check your browser settings.
      </p>
    </div>
  )
}
