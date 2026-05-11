import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Franco Selvarolo | Developer',
  description: 'Portfolio de desarrollo web, aplicaciones y automatizaciones',
  keywords: ['developer', 'portfolio', 'web', 'fullstack', 'React', 'Next.js'],
  openGraph: {
    title: 'Franco Selvarolo | Developer',
    description: 'Portfolio de desarrollo web, aplicaciones y automatizaciones',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="scanlines">{children}</body>
    </html>
  );
}
