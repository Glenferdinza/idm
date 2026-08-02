import './globals.css';

export const metadata = {
  title: 'MEMORA | Behavioral AI Telemetry Platform',
  description: 'MEMORA adalah platform edukasi berbasis AI behavioral telemetry untuk analisis kognitif siswa melalui pola pen, jeda berpikir, dan remedial adaptif real-time di Universitas Negeri Makassar',
  keywords: ['MEMORA', 'AI Telemetry', 'Adaptive Learning', 'Cognitive Diagnostics', 'UNM', 'Lomba IDM 2026'],
  authors: [{ name: 'Tim MEMORA UNM' }],
  openGraph: {
    title: 'MEMORA | Behavioral AI Telemetry Platform',
    description: 'Platform AI Behavioral Diagnostics berbasis telemetry pen stroke speed dan hesitation index untuk pendidikan adaptif.',
    url: 'https://memora.idm-unm.ac.id',
    siteName: 'MEMORA UNM',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEMORA | Behavioral AI Telemetry Platform',
    description: 'Sistem Analisis Pembelajaran Kognitif & Adaptif AI.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalApplication',
    'name': 'MEMORA',
    'applicationCategory': 'EducationalApplication',
    'operatingSystem': 'Web',
    'description': 'Platform AI Telemetry Kognitif dan Adaptif Learning.',
    'publisher': {
      '@type': 'Organization',
      'name': 'Universitas Negeri Makassar'
    }
  };

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
