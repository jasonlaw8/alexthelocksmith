import type { Metadata } from "next";
import { FullGallery } from "@/components/full-gallery";
import { ContactSection } from "@/components/contact-section";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Photo Gallery – Alex the Locksmith",
  description:
    "Browse photos of completed locksmith jobs across the SF Bay Area — lock installs, rekeys, smart locks, and more from Alex the Locksmith.",
  alternates: {
    canonical: "https://alexthelocksmith.net/gallery",
  },
};

export default function GalleryPage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Photo Gallery
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              A look at our completed work across the SF Bay Area.
            </p>
          </div>
          <FullGallery />
        </div>
      </section>

      <ContactSection />
      <SiteFooter />
    </>
  );
}
