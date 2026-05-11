'use client';

export default function Footer() {
  return (
    <footer className="relative border-t border-cyber-cyan/10 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border border-cyber-cyan/50 flex items-center justify-center">
            <div className="w-2 h-2 bg-cyber-cyan" />
          </div>
          <span className="font-display text-xs font-bold tracking-widest text-cyber-cyan">
            FS<span className="text-cyber-pink">.DEV</span>
          </span>
        </div>

        <p className="font-mono text-xs text-cyber-white/30">
          © {new Date().getFullYear()} Franco Selvarolo — Built with{' '}
          <span className="text-cyber-cyan">Next.js</span> +{' '}
          <span className="text-cyber-pink">Three.js</span>
        </p>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
          <span className="font-mono text-xs text-cyber-white/30">All systems nominal</span>
        </div>
      </div>
    </footer>
  );
}
