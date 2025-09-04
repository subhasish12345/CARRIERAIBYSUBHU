
import Link from 'next/link';

const socialLinks = [
  {
    href: 'https://github.com/subhasish12345',
    label: 'GitHub',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/in/subhasish-nayak-67a257280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    label: 'LinkedIn',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    href: 'https://x.com/Subhunew1Nayak?t=etWteaHNxNcUim6I600csQ&s=09',
    label: 'X (formerly Twitter)',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/subhasish_nayak_?igsh=OXF2ODZscGc1dzRw',
    label: 'Instagram',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163m0-2.163C8.74 0 8.333.011 7.053.069 3.003.219.988 2.223.84 6.27.058 7.546.047 7.954.047 12s.011 4.454.069 5.73c.149 4.047 2.165 6.051 6.217 6.198C8.333 23.988 8.74 24 12 24s3.667-.012 4.947-.069c4.051-.147 6.068-2.151 6.217-6.198.058-1.276.069-1.684.069-5.73s-.011-4.454-.069-5.73C23.012 2.223 20.997.219 16.947.069 15.667.012 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center space-x-6 sm:order-2">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">{item.label}</span>
                {item.icon}
              </a>
            ))}
          </div>
          <div className="mt-6 sm:order-1 sm:mt-0">
            <p className="text-center text-sm text-muted-foreground">
                <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                <span className="mx-2">|</span>
                &copy; {new Date().getFullYear()} CareerCompass AI. All rights reserved.
            </p>
            <p className="text-center text-xs text-muted-foreground mt-1">
                Created by Subhasish Nayak, a member of NANITES
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
