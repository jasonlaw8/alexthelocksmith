import { Hero } from "@/components/hero";
import { ContactSection } from "@/components/contact-section";
import { SiteFooter } from "@/components/site-footer";

type Service = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const SERVICES: Service[] = [
  {
    title: "Emergency Lockouts",
    description:
      "Locked out? We provide fast, damage-free entry 24/7 for your home, or office. Get back in quickly.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Residential & Commercial",
    description:
      "Complete locksmith services for your home and business, including high-security locks and master key systems.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
  },
  {
    title: "Lock Rekeying",
    description:
      "Secure a new property or restrict access by changing your lock's internal pins to work with a new key.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
      />
    ),
  },
  {
    title: "Lock Installation",
    description:
      "Professional installation of new deadbolts, door locks, and other security hardware to keep you safe.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    title: "Smart Lock Installation",
    description:
      "Upgrade to keyless convenience with our expert installation of smart locks, keypad locks, and digital entry systems.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
      />
    ),
  },
  {
    title: "Lock Repair",
    description:
      "From sticky deadbolts to broken keys, we diagnose and fix all types of lock issues to restore your security.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
      />
    ),
  },
  {
    title: "Car Key Services",
    description:
      "Lost your car keys? We cut and program car keys, key fobs, and transponder keys for most vehicle makes and models.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    ),
  },
];

const REVIEWS = [
  {
    quote:
      '"Alex did a great job today replacing my locks and rekeying one as well. He was professional, efficient, and clearly knew what he was doing. The quality of his work was excellent, and his pricing was very reasonable. I\'m happy with the results and would definitely recommend Alex to anyone needing a reliable locksmith."',
    name: "- Ivan W., San Carlos, CA",
  },
  {
    quote:
      '"Alex helped me install my new smart lock. Really professional work and clean finish on my door. He was on time and was very professional throughout the job."',
    name: "- Prerak P., Palo Alto, CA",
  },
  {
    quote:
      '"Alex was fantastic--prompt, professional, and very reasonably priced. He arrived on time, quickly diagnosed and fixed the issue, and even took extra time to make sure everything was working smoothly. Highly recommend!"',
    name: "- Ankur J., Belmont, CA",
  },
];

const GALLERY = [
  { src: "/images/IMG_7829.avif", alt: "Simplisafe Keypad", caption: "Simplisafe Keypad" },
  {
    src: "/images/IMG_4820.avif",
    alt: "New Handle and Lock Installation",
    caption: "New Door Lock Install",
  },
  { src: "/images/IMG_1477.avif", alt: "Gate Keypad Lock", caption: "Gate Keypad Lock" },
  { src: "/images/IMG_1264.avif", alt: "Rekey Lock", caption: "Rekey Lock" },
  { src: "/images/IMG_1252.avif", alt: "Lock Repair", caption: "Vintage Lock Repair" },
  {
    src: "/images/IMG_1231.avif",
    alt: "Car Key Programming",
    caption: "Smart Keypad and Deadbolt",
  },
  {
    src: "/images/IMG_1164.avif",
    alt: "Keypad Entry System",
    caption: "Sliding Door Lock Repair and Install",
  },
  {
    src: "/images/IMG_0532.avif",
    alt: "Heavy-Duty Commercial Lock",
    caption: "Commercial Door Lock",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* SERVICES + ABOUT + TESTIMONIALS (shared beige logo-watermark wrapper) */}
      <div className="relative logo-background-wrapper bg-brand-beige">
        <section id="services" className="py-16 sm:py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Services
              </h3>
              <p className="text-lg text-gray-600 mt-2">
                Comprehensive solutions for all your lock and key needs.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map((service) => (
                <div
                  key={service.title}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-brand-blue"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      {service.icon}
                    </svg>
                  </div>
                  <h4 className="text-2xl font-semibold mb-2">
                    {service.title}
                  </h4>
                  <p className="text-gray-700">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="pb-16 sm:pb-24 relative z-10">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="w-full md:w-1/3 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/profile.avif"
                  alt="Alex, the owner of Alex the Locksmith"
                  className="rounded-full w-48 h-48 md:w-64 md:h-64 mx-auto object-cover shadow-lg border-4 border-white"
                />
              </div>
              <div className="w-full md:w-2/3 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Meet Alex, Your Local Security Expert
                </h3>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  For over 15 years, I&apos;ve been the trusted locksmith for our
                  community. As the owner of Alex the Locksmith, we are
                  professionals dedicated to providing top-notch service with a
                  friendly touch. Our mission is to ensure your safety and peace
                  of mind by offering reliable solutions and transparent pricing.
                  We proudly serve the SF Bay Area, ready to respond whenever you
                  need us.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-16 sm:py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                What Our Customers Say
              </h3>
              <p className="text-lg text-gray-600 mt-2">
                We&apos;re proud of our 5-star service.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {REVIEWS.map((review) => (
                <div
                  key={review.name}
                  className="bg-white p-8 rounded-xl shadow-md"
                >
                  <p className="text-gray-600 mb-4">{review.quote}</p>
                  <p className="font-bold text-gray-900">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* GALLERY */}
      <section id="gallery" className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              A Showcase of Our Work
            </h3>
            <p className="text-lg text-gray-600 mt-2">
              Quality and precision in every job.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GALLERY.map((item) => (
              <div
                key={item.src}
                className="gallery-item group relative aspect-square overflow-hidden rounded-lg shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={400}
                  height={400}
                />
                <div className="caption absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <p className="text-white text-lg font-semibold text-center px-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      <SiteFooter />
    </>
  );
}
