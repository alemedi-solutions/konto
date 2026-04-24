import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gastos App',
  description: 'Control de gastos personal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
