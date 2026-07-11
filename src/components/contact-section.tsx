"use client";

import { ContactForm } from "@/components/contact-form";
import { gtagReportConversion, trackContact } from "@/lib/analytics";

const PHONE_TEL = "tel:1-650-444-1034";
const WHATSAPP_URL =
  "https://wa.me/16504441034?text=Hi%20Alex%2C%20I%20need%20locksmith%20services";

export function ContactSection() {
  return (
    <section id="contact" className="bg-brand-blue text-white">
      <div className="container mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold">
              Need Help? Contact Us Now
            </h3>
            <p className="mt-4 text-lg text-gray-300">
              Fill out the form or call us for immediate assistance. We&apos;re
              here to help 24/7.
            </p>
            <div className="mt-8">
              <a
                href={PHONE_TEL}
                onClick={() => {
                  gtagReportConversion();
                  trackContact("phone", "contact");
                }}
                className="text-3xl lg:text-4xl font-bold hover:text-gray-200"
              >
                Call: (650) 444-1034
              </a>
              <p className="mt-2 text-gray-300">24/7 Emergency Service</p>
            </div>
            <div className="mt-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                onClick={() => {
                  gtagReportConversion();
                  trackContact("whatsapp", "contact");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#25D366",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "18px",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexWrap: "nowrap",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ flexShrink: 0, minWidth: "24px" }}
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact on WhatsApp
              </a>
            </div>
          </div>
          <div
            id="form-container"
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8"
          >
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-white">
                Request a Service
              </h4>
              <p className="text-white/70 text-sm mt-1">
                We&apos;ll get back to you within 15 minutes
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
