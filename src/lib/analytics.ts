// Client-side analytics helpers ported from the original inline <script>.
// gtag() and the dataLayer are set up by the Google tag loaded in the root
// layout; these thin wrappers push the same events the static site sent.

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Phone/WhatsApp click conversion (Google Ads). */
export function gtagReportConversion() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "phone_click" });
  window.gtag?.("event", "conversion", {
    send_to: "AW-17201831360/EIiiCPPytNoaEMC7vIpA",
  });
}

/** GA4 tracking for contact button clicks. */
export function trackContact(method: string, location: string) {
  window.gtag?.("event", "contact_click", {
    contact_method: method,
    button_location: location,
  });
}

/** Normalize a US phone number into E.164 format for enhanced conversions. */
export function normalizePhoneE164(raw: string): string {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.charAt(0) === "1") return "+" + digits;
  return String(raw).charAt(0) === "+"
    ? String(raw).replace(/\s+/g, "")
    : "+" + digits;
}
