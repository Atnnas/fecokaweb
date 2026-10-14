import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FECOKA | Federación Costarricense de Karate',
    short_name: 'FECOKA',
    description: 'Sitio oficial de la Federación Costarricense de Karate. Entidad rectora del Karate-Do en Costa Rica.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0a0d',
    theme_color: '#0a0a0d',
    icons: [
      {
        src: '/assets/fecoka-logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/assets/fecoka-logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
