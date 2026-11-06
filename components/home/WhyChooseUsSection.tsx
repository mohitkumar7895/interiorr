import React from "react";
import {
  ShieldCheck,
  Award,
  Sparkles,
  Hammer,
  Clock,
  Layers,
  Wrench,
  ThumbsUp,
  Cpu
} from "lucide-react";

export default function WhyChooseUsSection() {
  const pillars = [
    {
      icon: <Hammer className="w-6 h-6 text-brand-gold" />,
      title: "Master Carpentry Workshop",
      desc: "Unlike interior aggregators who outsource to third-party laborers, we run our dedicated carpentry facility in Noida with handpicked generational wood artisans.",
    },
    {
      icon: <Layers className="w-6 h-6 text-brand-gold" />,
      title: "Marine Grade BWP Core",
      desc: "We exclusively fabricate modular kitchens and wardrobes using genuine Boiling Water Proof (BWP) calibrated plywood that resists moisture, termites, and warping.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-brand-gold" />,
      title: "German Hydraulic Hardware",
      desc: "Equipped with authentic Blum, Hettich, and Hafele soft-close hinges and tandem box drawer runners tested for over 200,000 smooth cycles.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-gold" />,
      title: "10-Year Structural Warranty",
      desc: "We back our craftsmanship with an unconditional 10-year warranty covering cabinetry structural integrity and premium fittings.",
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-gold" />,
      title: "45-Day Handover Guarantee",
      desc: "Strict project milestone planning ensures your dream home or modular kitchen is delivered completely finished within 45 to 60 days.",
    },
    {
      icon: <ThumbsUp className="w-6 h-6 text-brand-gold" />,
      title: "100% Transparent Fixed Pricing",
      desc: "No hidden surprise bills mid-project. Every sheet of laminate, cubic foot of teakwood, and hardware component is itemized upfront in our contract.",
    },
  ];

  return (
    <section className="relative py-24 bg-brand-black overflow-hidden">
      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            <span>The MA Advantage</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Why Choose <span className="gold-text-gradient">MA Carpenter</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-400">
            Uncompromising standards, generational wood craftsmanship, and architectural precision for the most discerning homeowners in Noida.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-charcoal/60 border border-brand-gold/20 hover:border-brand-gold/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-gold-sm group"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-gold/20 transition-all">
                {pillar.icon}
              </div>

              <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">
                {pillar.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

