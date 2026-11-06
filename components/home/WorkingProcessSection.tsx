import React from "react";
import {
  Ruler,
  Compass,
  Hammer,
  Truck,
  Sparkles,
  KeyRound,
  CheckCircle2
} from "lucide-react";

export default function WorkingProcessSection() {
  const steps = [
    {
      num: "01",
      icon: <Ruler className="w-6 h-6 text-brand-gold" />,
      title: "Free On-Site Consultation",
      desc: "Our senior design architect visits your site in Noida, conducts laser measurements, and understands your family's lifestyle aspirations.",
    },
    {
      num: "02",
      icon: <Compass className="w-6 h-6 text-brand-gold" />,
      title: "3D Photorealistic Design",
      desc: "We formulate 2D spatial layouts and realistic 3D VR renders. You finalize colors, veneers, acrylic finishes, and lighting moodboards.",
    },
    {
      num: "03",
      icon: <Hammer className="w-6 h-6 text-brand-gold" />,
      title: "Master Carpentry Fabrication",
      desc: "Your cabinetry, beds, and modular components are crafted in our Noida facility using high-precision CNC routers and edge banders.",
    },
    {
      num: "04",
      icon: <Truck className="w-6 h-6 text-brand-gold" />,
      title: "Clean On-Site Installation",
      desc: "Our technicians assemble components on-site with minimal noise, clean dust-controlled drilling, and strict laser-level alignment.",
    },
    {
      num: "05",
      icon: <KeyRound className="w-6 h-6 text-brand-gold" />,
      title: "Inspection & Keys Handover",
      desc: "Following a rigorous 120-point quality audit and deep-cleaning, we present you the keys to your dream home with 10-year warranty documents.",
    },
  ];

  return (
    <section className="relative py-24 bg-brand-charcoal/30 border-t border-brand-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            <span>Seamless Execution</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Our 5-Step <span className="gold-text-gradient">Working Process</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-400">
            A structured, transparent workflow ensuring exceptional design precision and timely handover without the typical renovation stress.
          </p>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-brand-surface/80 border border-brand-gold/25 hover:border-brand-gold/60 transition-all duration-300 hover:-translate-y-2 group flex flex-col justify-between"
            >
              {/* Step Number Top Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif font-black text-2xl gold-text-gradient tracking-wider">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-black transition-colors">
                  {step.icon}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-base font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Progress Line Accent */}
              <div className="w-full h-1 bg-brand-gold/20 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-brand-gold group-hover:w-full w-1/3 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

