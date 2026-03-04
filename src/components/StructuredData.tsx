export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WhipSpec",
    url: "https://whipspec.com",
    logo: "https://whipspec.com/logo.png",
    description: "Australia's automotive build showcase. Discover the exact parts, shops, and brands behind the builds you love.",
    sameAs: [
      "https://x.com/whipspec",
      "https://instagram.com/whipspec",
      "https://tiktok.com/@whipspec",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@whipspec.com",
      contactType: "customer service",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "AU",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WhipSpec",
    url: "https://whipspec.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://whipspec.com/discover?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function VehicleSchema({
  title, make, model, year, description, url, image,
}: {
  title: string; make?: string; model?: string; year?: number;
  description?: string; url: string; image?: string;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: title,
    url,
  };
  if (make) data.manufacturer = { "@type": "Organization", name: make };
  if (model) data.model = model;
  if (year) data.vehicleModelDate = String(year);
  if (description) data.description = description;
  if (image) data.image = image;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessSchema({
  name, description, location, url,
}: {
  name: string; description?: string; location?: string; url: string;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name,
    url,
  };
  if (description) data.description = description;
  if (location) {
    data.address = {
      "@type": "PostalAddress",
      addressLocality: location,
      addressCountry: "AU",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
