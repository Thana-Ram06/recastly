import Link from 'next/link';
import { Zap } from 'lucide-react';
import { XIcon, GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const socials = [
  { icon: XIcon, href: 'https://twitter.com', label: 'X / Twitter' },
  { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-brand-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Recastly</span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              Transform any YouTube video into platform-perfect content with AI. Built for creators who move fast.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                {section}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Recastly. All rights reserved.
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Made with ♥ for content creators
          </p>
        </div>
      </div>
    </footer>
  );
}
