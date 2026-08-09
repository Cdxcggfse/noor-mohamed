import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-6xl text-gold font-light mb-4">404</h1>
      <h2 className="font-display text-2xl text-parchment font-medium mb-2">Page Not Found</h2>
      <p className="font-sans text-smoke text-sm mb-8">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-gold text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:bg-parchment transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}
