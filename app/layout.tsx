import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Konto',
  description: 'Control de gastos personal',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Konto',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="light">
      <head>
        {/* iOS PWA viewport fix: --vh usa window.innerHeight real, no dvh que falla en primer render */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            function setVH(){
              document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
            }
            setVH();
            window.addEventListener('resize', setVH);
          })();
        `}}/>
      </head>
      <body>{children}</body>
    </html>
  );
}
