const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://alexthelocksmith.net";

const SERVICE_AREA_CITIES = [
  "San Bruno",
  "Millbrae",
  "Burlingame",
  "Hillsborough",
  "San Mateo",
  "Belmont",
  "San Carlos",
  "Redwood City",
  "Atherton",
  "Menlo Park",
  "Woodside",
  "Emerald Hills",
  "Palo Alto",
  "Mountain View",
  "Pacifica",
  "El Granada",
  "Half Moon Bay",
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Locksmith",
  name: "Alex the Locksmith",
  image: `${SITE_URL}/images/websitelogo.avif`,
  url: SITE_URL,
  telephone: "+1-650-444-1034",
  priceRange: "$$",
  areaServed: SERVICE_AREA_CITIES.map((name) => ({
    "@type": "City",
    name: `${name}, CA`,
  })),
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
};

export function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
    />
  );
}
