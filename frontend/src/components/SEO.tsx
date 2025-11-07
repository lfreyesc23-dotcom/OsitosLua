import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: Record<string, any>;
}

const SEO = ({
  title = 'OsitosLua - Los Mejores Peluches de Chile',
  description = 'Descubre nuestra colección de peluches adorables de la más alta calidad. Envíos a todo Chile. Compra segura con Stripe. Encuentra el peluche perfecto para ti o para regalar.',
  keywords = 'peluches, peluches chile, ositos de peluche, juguetes, regalos, peluches tiernos, peluches suaves, comprar peluches, tienda peluches',
  image = 'https://ositoslua.cl/og-image.jpg',
  url = 'https://ositoslua.cl',
  type = 'website',
  structuredData
}: SEOProps) => {
  const siteTitle = title === 'OsitosLua - Los Mejores Peluches de Chile' 
    ? title 
    : `${title} | OsitosLua`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="OsitosLua" />
      <meta property="og:locale" content="es_CL" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="OsitosLua" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta name="geo.region" content="CL" />
      <meta name="geo.placename" content="Santiago" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
