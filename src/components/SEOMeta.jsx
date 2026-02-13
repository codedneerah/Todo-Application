import { Helmet } from 'react-helmet-async';

export default function SEOMeta({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonicalUrl,
  type = 'website',
}) {
  const siteTitle = 'TodoApp - Manage Your Tasks Efficiently';
  const defaultDescription =
    'A modern task management application built with React, featuring real-time updates and intuitive task management.';
  const defaultImage = `${typeof window !== 'undefined' ? window.location.origin : ''}/og-image.png`;
  const defaultUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={ogTitle || title || siteTitle} />
      <meta property="og:description" content={ogDescription || description || defaultDescription} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:url" content={ogUrl || defaultUrl} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title || siteTitle} />
      <meta name="twitter:description" content={ogDescription || description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {/* Additional Meta Tags */}
      <meta name="author" content="TodoApp Team" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Structured Data - JSON-LD */}
      {type === 'website' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: siteTitle,
            url: defaultUrl,
            description: description || defaultDescription,
            applicationCategory: 'ProductivityApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          })}
        </script>
      )}
    </Helmet>
  );
}
