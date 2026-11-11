import React from "react";
import { MapPin, Navigation, Phone, Clock, ExternalLink } from "lucide-react";

export default function LocationMapSection() {
  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";
  const address =
    process.env.NEXT_PUBLIC_ADDRESS ||
    "Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301";

  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Shop+No+6+Sector+120+Noida+Uttar+Pradesh+201301";

  return (
    <section className="relative py-20 bg-brand-charcoal/40 border-t border-brand-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-brand-surface/90 border border-brand-gold/30 p-5 sm:p-8 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
                <MapPin size={13} />
                <span>Visit Our Studio</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                Located in the Heart of <span className="gold-text-gradient">Sector 120, Noida</span>
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Visit our design studio and sample gallery to explore physical material swatches, solid teakwood finishes, acrylic and PU shutters, and quartz stone samples.
              </p>

              <div className="space-y-3 pt-2 text-xs text-brand-cream">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Studio Address:</span>
                    <span className="text-gray-300">{address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-brand-gold flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Studio Hours:</span>
                    <span className="text-gray-300">Monday - Sunday: 9:00 AM - 8:30 PM</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-brand-gold flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Direct Inquiries:</span>
                    <a href={`tel:+91${phone}`} className="text-brand-gold font-bold hover:underline">
                      +91 {phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-charcoal hover:bg-brand-black border border-brand-gold/40 text-brand-gold hover:text-brand-goldLight text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Navigation size={14} />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Right Map Embed */}
            <div className="lg:col-span-7 h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-brand-gold/30 shadow-xl relative">
              <iframe
                title="MA Carpenter and Interior Sector 120 Noida Location Map"
                src="https://maps.google.com/maps?q=Shop+No+6+Sector+120+Noida+Uttar+Pradesh+201301&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(1.1)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

