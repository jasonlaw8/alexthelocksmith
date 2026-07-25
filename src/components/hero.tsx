"use client";

import { gtagReportConversion, trackContact } from "@/lib/analytics";

const PHONE_TEL = "tel:1-650-444-1034";
const WHATSAPP_URL =
  "https://wa.me/16289461839?text=Hi%20Alex%2C%20I%20need%20locksmith%20services";

export function Hero() {
  return (
    <section className="hero-pattern text-white text-center py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          Alex the Locksmith
        </h1>
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-2 text-brand-beige">
          Fast, Reliable Locksmith Services
        </h2>
        <p className="text-2xl md:text-3xl font-semibold text-gray-300 mb-8">
          Serving the Entire SF Bay Area
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href={PHONE_TEL}
            onClick={() => {
              gtagReportConversion();
              trackContact("phone", "hero");
            }}
            className="w-full sm:w-auto bg-white text-brand-blue font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-200 cta-button"
          >
            Call for Emergency Service
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            onClick={() => {
              gtagReportConversion();
              trackContact("whatsapp", "hero");
            }}
            className="w-full sm:w-auto text-white font-bold py-4 px-8 rounded-lg text-lg hover:opacity-90 cta-button flex items-center justify-center gap-2 shadow-xl ring-4 ring-white/30"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Us
          </a>
        </div>
        <div className="mt-8">
          <a
            href={PHONE_TEL}
            onClick={() => {
              gtagReportConversion();
              trackContact("phone", "hero_secondary");
            }}
            className="text-2xl lg:text-3xl font-bold text-white hover:text-gray-200"
          >
            Or Call Now: (650) 444-1034
          </a>
        </div>
      </div>
    </section>
  );
}
