import { GALLERY_PHOTOS } from "@/lib/gallery-photos";

const PHOTOS = GALLERY_PHOTOS;

export function PhotoMarquee() {
  return (
    <div className="marquee-viewport">
      <div className="marquee-track">
        {[...PHOTOS, ...PHOTOS].map((photo, index) => (
          <div
            key={`${photo.src}-${index}`}
            className="shrink-0 w-48 h-48 sm:w-56 sm:h-56 rounded-lg shadow-md overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover"
              loading="lazy"
              width={224}
              height={224}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
