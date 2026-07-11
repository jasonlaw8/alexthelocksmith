"use client";

import { useRef } from "react";
import { normalizePhoneE164, trackContact } from "@/lib/analytics";

const SELECT_ARROW =
  "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')";

const INPUT_CLASS =
  "w-full px-4 py-3 bg-white rounded-lg border-2 border-transparent focus:border-brand-beige focus:outline-none";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);

  // Ported from the original inline <script>: track the submission + fire the
  // Google Ads enhanced-conversion, then let the form POST to Jotform natively.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    trackContact("form", "contact");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "form_submission",
      form_id: "contact-form",
      form_name: "Submit Contact Form",
    });

    // Enhanced conversions: provide user-supplied data via in-page gtag.
    const nameField = form.elements.namedItem("q12_name") as HTMLInputElement | null;
    const emailField = form.elements.namedItem(
      "q13_email",
    ) as HTMLInputElement | null;
    const phoneField = form.elements.namedItem(
      "q4_phoneNumber[full]",
    ) as HTMLInputElement | null;
    const addressField = form.elements.namedItem(
      "q15_address[addr_line1]",
    ) as HTMLInputElement | null;

    const fullName = nameField?.value ? nameField.value.trim() : "";
    let firstName = "";
    let lastName = "";
    if (fullName) {
      const parts = fullName.split(/\s+/);
      firstName = parts.shift() || "";
      lastName = parts.join(" ");
    }

    const userData: Record<string, unknown> = {};
    const emailValue = emailField?.value
      ? emailField.value.trim().toLowerCase()
      : "";
    if (emailValue) userData.email = emailValue;
    const phoneE164 = normalizePhoneE164(phoneField?.value ?? "");
    if (phoneE164) userData.phone_number = phoneE164;
    if (firstName || lastName || addressField?.value) {
      const addr: Record<string, unknown> = {};
      if (firstName) addr.first_name = firstName;
      if (lastName) addr.last_name = lastName;
      if (addressField?.value) {
        addr.street = addressField.value.trim();
        addr.country = "US";
      }
      userData.address = addr;
    }
    if (userData.email || userData.phone_number || userData.address) {
      window.gtag?.("set", "user_data", userData);
    }

    let submitted = false;
    const submitOnce = () => {
      if (submitted) return;
      submitted = true;
      form.submit();
    };

    window.gtag?.("event", "conversion", {
      send_to: "AW-17201831360/Ecl-CPnjtNoaEMC7vIpA",
      event_callback: submitOnce,
    });
    // Fallback: submit after 1s if gtag callback doesn't fire.
    setTimeout(submitOnce, 1000);
  }

  return (
    <form
      ref={formRef}
      action="https://submit.jotform.com/submit/253490894394168"
      method="post"
      id="contact-form"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="formID" value="253490894394168" />
      <input
        type="hidden"
        name="simple_spc"
        value="253490894394168-253490894394168"
      />

      {/* Name */}
      <div className="mb-4">
        <label htmlFor="q12_name" className="block text-white font-medium mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="q12_name"
          name="q12_name"
          className={INPUT_CLASS}
          style={{ color: "#1f2937", height: "50px" }}
          placeholder="Enter your full name"
        />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label
          htmlFor="q4_phoneNumber"
          className="block text-white font-medium mb-2"
        >
          Phone Number <span className="text-red-400">*</span>
        </label>
        <input
          type="tel"
          id="q4_phoneNumber"
          name="q4_phoneNumber[full]"
          required
          className={INPUT_CLASS}
          style={{ color: "#1f2937", height: "50px" }}
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Email (optional) */}
      <div className="mb-4">
        <label htmlFor="q13_email" className="block text-white font-medium mb-2">
          Email{" "}
          <span className="text-white/60 font-normal text-sm">(optional)</span>
        </label>
        <input
          type="email"
          id="q13_email"
          name="q13_email"
          className={INPUT_CLASS}
          style={{ color: "#1f2937", height: "50px" }}
          placeholder="you@example.com"
        />
      </div>

      {/* Service Type */}
      <div className="mb-4">
        <label
          htmlFor="q14_serviceRequest"
          className="block text-white font-medium mb-2"
        >
          What do you need help with?
        </label>
        <select
          id="q14_serviceRequest"
          name="q14_serviceRequest"
          className="w-full px-4 bg-white rounded-lg border-2 border-transparent focus:border-brand-beige focus:outline-none cursor-pointer"
          style={{
            color: "#1f2937",
            height: "50px",
            WebkitAppearance: "none",
            MozAppearance: "none",
            appearance: "none",
            backgroundImage: SELECT_ARROW,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            backgroundSize: "12px",
            paddingRight: "40px",
          }}
          defaultValue=""
        >
          <option value="">Choose a service...</option>
          <option value="Emergency Lockout">Emergency Lockout</option>
          <option value="Lock Rekeying">Lock Rekeying</option>
          <option value="Lock Installation">Lock Installation</option>
          <option value="Lock Repair">Lock Repair</option>
          <option value="Digital Lock Installation">
            Smart Lock Installation
          </option>
          <option value="Car Key Replacement">Car Key Replacement</option>
          <option value="Residential">Residential Service</option>
          <option value="Commercial">Commercial Service</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Address */}
      <div className="mb-4">
        <label
          htmlFor="q15_address"
          className="block text-white font-medium mb-2"
        >
          Service Location{" "}
          <span className="text-white/60 font-normal text-sm">(optional)</span>
        </label>
        <input
          type="text"
          id="q15_address"
          name="q15_address[addr_line1]"
          className={INPUT_CLASS}
          style={{ color: "#1f2937", height: "50px" }}
          placeholder="Street address or cross streets"
        />
      </div>

      {/* Additional Notes */}
      <div className="mb-6">
        <label
          htmlFor="q9_additionalRequests"
          className="block text-white font-medium mb-2"
        >
          Tell us more{" "}
          <span className="text-white/60 font-normal text-sm">(optional)</span>
        </label>
        <textarea
          id="q9_additionalRequests"
          name="q9_additionalRequests"
          rows={3}
          className="w-full px-4 py-3 bg-white rounded-lg border-2 border-transparent focus:border-brand-beige focus:outline-none resize-none"
          style={{ color: "#1f2937" }}
          placeholder="Describe your situation - locked out? Need new locks? Any details help us serve you faster."
        ></textarea>
      </div>

      {/* Honeypot for spam */}
      <div style={{ display: "none" }}>
        <input type="text" name="website" defaultValue="" />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-brand-beige text-brand-blue font-bold py-4 px-6 rounded-xl text-lg hover:bg-white transition-all shadow-lg"
      >
        Get a Free Quote
      </button>

      <p className="text-white/70 text-center text-sm mt-4">
        No obligation · Fast response · Available 24/7
      </p>
    </form>
  );
}
