import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-brand-600 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L8 3L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 10H11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-zinc-400">Recastly</span>
        </div>

        <p className="text-xs text-zinc-600 order-last sm:order-none">
          © {new Date().getFullYear()} Recastly. All rights reserved.
        </p>

        <div className="flex items-center gap-5 text-xs text-zinc-600">
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          <Link href="/terms"   className="hover:text-zinc-400 transition-colors">Terms</Link>
          <Link href="/#pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
        </div>
      </div>
    </footer>
  );
}
