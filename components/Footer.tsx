import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shrink-0">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 10H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-zinc-500 tracking-tight">Recastly</span>
        </div>

        <p className="text-xs text-zinc-700 order-last sm:order-none tracking-wide">
          © {new Date().getFullYear()} Recastly. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-xs text-zinc-600">
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          <Link href="/terms"   className="hover:text-zinc-400 transition-colors">Terms</Link>
          <Link href="/#pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
        </div>
      </div>
    </footer>
  );
}
