import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Career Clarity | AI-Era Engineering Leveling & Career Navigation',
  description:
    'Benchmark engineering levels across tech giants, master AI-era skills, and prepare with curated interview roadmaps.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        {children}
      </body>
    </html>
  );
}
