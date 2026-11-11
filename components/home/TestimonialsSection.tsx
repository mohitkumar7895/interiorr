import React from "react";
import { Star, Quote, Sparkles } from "lucide-react";

interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  clientLocation: string;
  rating: number;
  reviewText: string;
}

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="relative py-24 bg-brand-charcoal/50 border-t border-brand-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            <span>Client Praise</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Customer <span className="gold-text-gradient">Testimonials</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-400">
            Read what delighted homeowners in Sector 120 Noida and surrounding NCR communities say about our carpentry excellence.
          </p>
        </div>

        {/* Testimonials Grid - Exactly 4 in 1 line on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 items-stretch">
          {testimonials.slice(0, 4).map((test) => (
            <div
              key={test.id}
              className="p-5 xl:p-6 rounded-2xl bg-brand-surface/80 border border-brand-gold/25 hover:border-brand-gold/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-gold-sm flex flex-col justify-between group"
            >
              <div>
                {/* 5-Star Gold Rating */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-1 text-brand-gold">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-brand-gold" />
                    ))}
                  </div>
                  <Quote size={20} className="text-brand-gold/30 group-hover:text-brand-gold transition-colors flex-shrink-0" />
                </div>

                <p className="text-xs text-gray-300 italic leading-relaxed">
                  &ldquo;{test.reviewText}&rdquo;
                </p>
              </div>

              {/* Author Info Footer */}
              <div className="pt-4 mt-5 border-t border-brand-gold/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center font-serif font-bold text-brand-gold text-xs flex-shrink-0">
                  {test.clientName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-xs font-bold text-white group-hover:text-brand-gold transition-colors truncate">
                    {test.clientName}
                  </h4>
                  <p className="text-[10px] text-gray-400 truncate">
                    {test.clientRole}
                  </p>
                  <p className="text-[10px] text-brand-goldLight font-medium truncate">
                    {test.clientLocation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

