"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── GSAP Registration ───────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const BRANDS = [
  { name: "Aquaguard", icon: "💧" },
  { name: "Bluestar",  icon: "🌊" },
  { name: "Bpure",     icon: "💦" },
  { name: "Kent",      icon: "🫧" },
  { name: "Livpure",   icon: "💧" },
  { name: "Pureit",    icon: "🌊" },
  { name: "LG",        icon: "💦" },
  { name: "Whirlpool", icon: "🫧" },
];

const SERVICES = [
  {
    icon: "🚿",
    title: "Doorstep Delivery",
    desc: "We deliver and install your rented purifier right at your home — hassle-free within 24 hours of booking.",
    price: "Free Delivery",
  },
  {
    icon: "🔧",
    title: "Free Maintenance",
    desc: "All rentals include scheduled maintenance, filter checks, and servicing at no extra cost.",
    price: "Included",
  },
  {
    icon: "🔬",
    title: "Filter Replacement",
    desc: "Membrane, Carbon, CTO and all filter types replaced on schedule — fully covered in your rental.",
    price: "Covered",
  },
  {
    icon: "🛠️",
    title: "Free Repairs",
    desc: "Any breakdown? We fix it same-day at no charge. Your rental includes full repair coverage.",
    price: "Zero Cost",
  },
  {
    icon: "🔄",
    title: "Upgrade Anytime",
    desc: "Switch to a newer or better purifier model anytime during your rental period — no questions asked.",
    price: "Flexible",
  },
  {
    icon: "🏠",
    title: "Pickup & Relocation",
    desc: "Moving? We pick up, relocate, and reinstall your rented purifier at your new address for free.",
    price: "Zero Charges",
  },
];

const PLANS = [
  {
    name: "3 Months",
    price: "₹599",
    period: "/month",
    color: "#3b82f6",
    features: [
      "Any 1 Purifier Model",
      "Free Installation",
      "Free Maintenance",
      "Filter Replacement Covered",
      "Phone Support",
    ],
    popular: false,
  },
  {
    name: "6 Months",
    price: "₹499",
    period: "/month",
    color: "#1e3a8a",
    features: [
      "Any 1 Purifier Model",
      "Free Installation",
      "Free Maintenance",
      "Filter Replacement Covered",
      "Priority Support",
      "Free Relocation",
    ],
    popular: true,
  },
  {
    name: "12 Months",
    price: "₹399",
    period: "/month",
    color: "#0f172a",
    features: [
      "Any 1 Purifier Model",
      "Free Installation",
      "Free Maintenance",
      "All Filter Replacements",
      "Membrane Covered",
      "24/7 Emergency Support",
      "Free Relocation",
    ],
    popular: false,
  },
];

const STATS = [
  { value: "500+", label: "Happy Renters" },
  { value: "20+",  label: "Brands Available" },
  { value: "200+", label: "Areas Covered" },
  { value: "5★",   label: "Rental Rating" },
];

const TESTIMONIALS = [
  {
    name: "Ravi Kumar",
    area: "MVP Colony",
    rating: 5,
    text: "Rented for 6 months and it's been amazing. Purifier was installed the same day, and maintenance is totally free. Best decision!",
  },
  {
    name: "Priya Sharma",
    area: "Maddilapalem",
    rating: 5,
    text: "No upfront cost, free service, and they even shifted the purifier when I moved. MKL rentals are unbeatable in Vizag.",
  },
  {
    name: "Suresh Babu",
    area: "Gajuwaka",
    rating: 5,
    text: "Paying monthly is so much easier than buying outright. Clean water every day and zero maintenance worries.",
  },
];

// ─── WATER BLOB SVG ──────────────────────────────────────────────────────────
function WaterBlob({ className = "", color = "#1e3a8a", opacity = 0.08, size = 600, animate = true }) {
  const blobRef = useRef(null);
  useEffect(() => {
    if (!animate || !blobRef.current) return;
    gsap.to(blobRef.current, {
      attr: { d: "M60,0 C93,0 120,27 120,60 C120,93 100,115 60,120 C20,125 0,93 0,60 C0,27 27,0 60,0 Z" },
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [animate]);
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        ref={blobRef}
        d="M60,0 C95,5 120,30 115,65 C110,100 85,120 50,118 C15,116 0,90 0,60 C0,25 25,-5 60,0 Z"
        fill={color}
        fillOpacity={opacity}
      />
    </svg>
  );
}

// ─── RIPPLE BUTTON ───────────────────────────────────────────────────────────
function RippleButton({ children, className = "", onClick, href, type }) {
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    onClick && onClick(e);
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} type={type} className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {ripples.map((rp) => (
        <span
          key={rp.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: rp.x - 50,
            top: rp.y - 50,
            width: 100,
            height: 100,
            background: "rgba(255,255,255,0.3)",
            animation: "ripple 0.7s ease-out forwards",
          }}
        />
      ))}
      {children}
    </Tag>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.fromTo(".hero-eyebrow", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
        .fromTo(".hero-title",   { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.4")
        .fromTo(".hero-sub",     { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.4")
        .fromTo(".hero-ctas",    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3")
        .fromTo(".hero-stat",    { y: 20, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.4)" }, "-=0.2");

      gsap.to(".blob-1", { y: -30, x: 15,  duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob-2", { y: 25,  x: -20, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
      gsap.to(".blob-3", { y: -20, x: 10,  duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });

      document.querySelectorAll(".drop").forEach((drop, i) => {
        gsap.to(drop, {
          y: "120vh",
          opacity: 0,
          duration: gsap.utils.random(3, 7),
          repeat: -1,
          delay: i * 0.4,
          ease: "power1.in",
          onRepeat: () => { gsap.set(drop, { y: -20, opacity: gsap.utils.random(0.3, 0.8) }); },
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #1e3a8a 50%, #1e4db7 100%)" }}
    >
      {/* Animated water blobs */}
      <div className="blob-1 absolute -top-32 -right-32 opacity-20 pointer-events-none">
        <WaterBlob color="#60a5fa" opacity={1} size={500} />
      </div>
      <div className="blob-2 absolute -bottom-40 -left-40 opacity-15 pointer-events-none">
        <WaterBlob color="#93c5fd" opacity={1} size={600} />
      </div>
      <div className="blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <WaterBlob color="#bfdbfe" opacity={1} size={800} />
      </div>

      {/* Falling water drops */}
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          className="drop absolute text-blue-300 text-opacity-60 pointer-events-none select-none"
          style={{ left: `${(i * 8.5) % 100}%`, top: `-${20 + i * 7}px`, fontSize: `${8 + (i % 5) * 3}px`, opacity: 0.5 }}
        >
          💧
        </span>
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="#f1f5f9" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-24 grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <div className="hero-eyebrow inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
            <span className="text-blue-200 text-sm font-semibold tracking-wider uppercase">
              Visakhapatnam&apos;s #1 Purifier Rental Service
            </span>
          </div>

          <h1 className="hero-title text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Pure Water.
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #93c5fd, #bfdbfe)" }}
            >
              Better Life.
            </span>
          </h1>

          <p className="hero-sub text-lg text-blue-200 leading-relaxed mb-8 max-w-lg">
            Rent premium water purifiers with zero upfront cost. Flexible plans
            with free installation, maintenance, and filter replacement. Expert
            support across Visakhapatnam.
          </p>

          <div className="hero-ctas flex flex-wrap gap-4">
            <RippleButton
              href="/contact"
              className="flex items-center gap-2 bg-white text-[#1e3a8a] font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/20 text-base"
            >
              <span>💧</span> Start Your Rental
            </RippleButton>
            <a
              href="/plans"
              className="flex items-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 hover:border-white transition-all text-base"
            >
              View Plans <span>→</span>
            </a>
          </div>
        </div>

        {/* Right — Stats */}
        <div className="grid grid-cols-2 gap-4">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="hero-stat group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="text-4xl font-black text-white mb-1" style={{ fontVariantNumeric: "tabular-nums" }}>
                {s.value}
              </div>
              <div className="text-blue-200 text-sm font-medium">{s.label}</div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-blue-400/0 via-blue-300/60 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BRANDS MARQUEE ──────────────────────────────────────────────────────────
function BrandsMarquee() {
  const trackRef = useRef(null);
  useEffect(() => {
    if (!trackRef.current) return;
    gsap.to(trackRef.current, { x: "-50%", duration: 20, repeat: -1, ease: "none" });
  }, []);

  const doubled = [...BRANDS, ...BRANDS];
  return (
    <section className="py-14 bg-white border-b border-slate-100 overflow-hidden">
      <p className="text-center text-xs font-bold tracking-widest uppercase text-slate-400 mb-8">
        Authorized Service for All Major Brands
      </p>
      <div className="relative">
        <div ref={trackRef} className="flex gap-12 whitespace-nowrap w-max">
          {doubled.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-50 border border-blue-100 hover:border-[#1e3a8a] hover:bg-blue-100 transition-all cursor-default group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{b.icon}</span>
              <span className="font-bold text-slate-700 text-sm">{b.name}</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

// ─── SERVICES PREVIEW ────────────────────────────────────────────────────────
function ServicesPreview() {
  const sectionRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-card",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".services-grid", start: "top 80%", once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-24 bg-[#f1f5f9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Every Service You <span className="text-[#1e3a8a]">Need</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            From installation to emergency repair — we handle everything so you always have clean water.
          </p>
        </div>

        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="service-card group bg-white rounded-3xl p-8 border border-slate-100 hover:border-[#1e3a8a]/30 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-2 cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl mb-5 group-hover:bg-[#1e3a8a] group-hover:scale-110 transition-all duration-300">
                <span>{s.icon}</span>
              </div>
              <h3 className="font-black text-slate-900 text-lg mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1e3a8a] text-sm">{s.price}</span>
                <a href="/contact" className="text-xs font-bold text-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Book Now →
                </a>
              </div>
              <div className="mt-4 h-0.5 rounded-full bg-gradient-to-r from-blue-200 to-[#1e3a8a] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </div>
          ))}
        </div>

        {/* View All Services CTA */}
        <div className="text-center mt-12">
          <a
            href="/services"
            className="inline-flex items-center gap-2 border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold px-8 py-3.5 rounded-2xl hover:bg-[#1e3a8a] hover:text-white transition-all duration-300"
          >
            View All Services →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ────────────────────────────────────────────────────────────
function HowItWorks() {
  const ref = useRef(null);
  const steps = [
    { num: "01", icon: "📱", title: "Choose Your Plan",    desc: "Pick a rental plan - 3 months, 6 months, or 12 months. No long-term commitment." },
    { num: "02", icon: "🏠", title: "Free Installation",   desc: "Certified technician delivers and installs your purifier at your home within 24 hours." },
    { num: "03", icon: "⚙️", title: "Free Maintenance",    desc: "Regular maintenance, filter replacements, and repairs included in your rental." },
    { num: "04", icon: "📄", title: "Flexible Options",    desc: "Upgrade anytime, relocate, or cancel - complete flexibility throughout your rental." },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".how-step",
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <WaterBlob className="absolute -right-40 top-0 opacity-40" color="#dbeafe" size={500} animate={false} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
            Easy Rental Process
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            How To <span className="text-[#1e3a8a]">Get Started</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="how-step relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-3/4 w-full h-px bg-gradient-to-r from-[#1e3a8a]/30 to-blue-200/30 z-0" />
              )}
              <div className="relative z-10 text-center">
                <div className="relative inline-flex">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1e3a8a] to-blue-500 flex items-center justify-center text-3xl shadow-xl shadow-blue-900/20 mx-auto mb-4">
                    {s.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] font-black text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Learn More CTA */}
        <div className="text-center mt-12">
          <a
            href="/how-it-works"
            className="inline-flex items-center gap-2 border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold px-8 py-3.5 rounded-2xl hover:bg-[#1e3a8a] hover:text-white transition-all duration-300"
          >
            Learn More →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PLANS PREVIEW ───────────────────────────────────────────────────────────
function PlansPreview() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".plan-card",
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)",
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="plans"
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0a1628 0%, #1e3a8a 60%, #1e4db7 100%)" }}
    >
      {/* Decorative waves */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full fill-[#f1f5f9]">
          <path d="M0,0 C480,80 960,0 1440,60 L1440,0 Z" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full fill-white">
          <path d="M0,80 C360,0 960,80 1440,30 L1440,80 Z" />
        </svg>
      </div>

      <WaterBlob className="absolute top-0 right-0 opacity-10" color="#93c5fd" size={500} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-white/10 text-blue-200 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-white/20 mb-4">
            Rental Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Simple, Honest <span className="text-blue-300">Pricing</span>
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto">
            Choose a rental plan that fits your needs. All plans include free delivery, installation, maintenance, and filter replacements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={`plan-card relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-3 ${
                plan.popular ? "ring-2 ring-blue-300 ring-offset-4 ring-offset-[#1e3a8a]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-blue-300 text-[#1e3a8a] text-xs font-black px-3 py-1 rounded-full z-10">
                  Most Popular
                </div>
              )}
              <div className={`p-8 ${plan.popular ? "bg-white" : "bg-white/10 backdrop-blur-md border border-white/20"}`}>
                <h3 className={`font-black text-xl mb-1 ${plan.popular ? "text-[#1e3a8a]" : "text-white"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-5xl font-black ${plan.popular ? "text-[#1e3a8a]" : "text-white"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm font-medium ${plan.popular ? "text-slate-400" : "text-blue-200"}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${plan.popular ? "bg-[#1e3a8a] text-white" : "bg-white/20 text-white"}`}>
                        ✓
                      </span>
                      <span className={`text-sm font-medium ${plan.popular ? "text-slate-700" : "text-blue-100"}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <RippleButton
                  href="/contact"
                  className={`w-full inline-flex items-center justify-center px-6 py-3.5 mt-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                    plan.popular
                      ? "bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-lg shadow-blue-900/30"
                      : "bg-white/15 text-white border border-white/30 hover:bg-white/25"
                  }`}
                >
                  Get Started
                </RippleButton>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/plans"
            className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/20 transition-all duration-300"
          >
            See Full Plan Details →
          </a>
        </div>

        <p className="text-center text-blue-300/60 text-sm mt-6">
          All plans include doorstep service · Genuine spare parts · Certified technicians
        </p>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
function Testimonials() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testi-card",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
            Customer Love
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            What Our <span className="text-[#1e3a8a]">Customers Say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="testi-card bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-blue-900/10 transition-all hover:-translate-y-1"
            >
              <div className="flex text-yellow-400 mb-4 text-lg">{"★".repeat(t.rating)}</div>
              <p className="text-slate-700 leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-black text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.area}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ENQUIRY FORM ─────────────────────────────────────────────────────────────
function EnquiryForm() {
  const ref = useRef(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".form-inner",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Replace with actual API call: POST /api/public/enquiry
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section
      ref={ref}
      id="enquiry"
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0a1628 0%, #1e3a8a 100%)" }}
    >
      <WaterBlob className="absolute -bottom-20 -right-20 opacity-10" color="#93c5fd" size={500} />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block bg-white/10 text-blue-200 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-white/20 mb-4">
            Contact Us
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Get in <span className="text-blue-300">Touch</span>
          </h2>
          <p className="text-blue-200">Fill out the form and our team will contact you shortly.</p>
        </div>

        <div className="form-inner bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/30">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Enquiry Submitted!</h3>
              <p className="text-slate-500 mb-6">
                Thank you for contacting us.<br />Our team will get back to you soon.
              </p>
              <a
                href="https://wa.me/918179019929?text=Hi!%20I%20just%20submitted%20an%20enquiry."
                className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-green-600 transition-colors"
              >
                <span>💬</span> Chat on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text" required placeholder="Enter your name"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:border-[#1e3a8a] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number *</label>
                <input
                  type="tel" required pattern="[0-9]{10}" placeholder="Enter 10-digit number"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:border-[#1e3a8a] focus:outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email" required placeholder="Enter your email"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:border-[#1e3a8a] focus:outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea
                  rows={5} placeholder="Write your message here..."
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:border-[#1e3a8a] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <RippleButton
                  type="submit"
                  className="w-full py-4 bg-[#1e3a8a] text-white font-bold rounded-2xl hover:bg-blue-800 transition-colors flex items-center justify-center gap-3 text-base shadow-xl shadow-blue-900/30"
                >
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><span>📩</span> Submit Enquiry</>
                  )}
                </RippleButton>
                <p className="text-center text-xs text-slate-400 mt-3">
                  By submitting, you agree to be contacted by MKL Enterprises.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT BAND ───────────────────────────────────────────────────────────────
function AboutBand() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [".about-left", ".about-right"],
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="about" className="py-24 bg-[#f1f5f9]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="about-left">
          <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
            About MKL
          </span>
          <h2 className="text-4xl font-black text-slate-900 mb-6">
            Vizag&apos;s Trusted<br />
            <span className="text-[#1e3a8a]">Water Experts</span>
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            MKL Enterprises has been serving Visakhapatnam families with pure, safe drinking water solutions.
            Based at NAD Junction, we combine expert knowledge with genuine care for every customer.
          </p>
          <p className="text-slate-600 leading-relaxed mb-8">
            With 500+ satisfied customers, 15+ major brands serviced, and coverage across 200+ areas —
            we&apos;re committed to ensuring your family always has clean water.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            {["Genuine spare parts", "Certified technicians", "Same-day service", "Transparent billing"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-[#1e3a8a]" /> {item}
              </div>
            ))}
          </div>
          <a
            href="/about"
            className="inline-flex items-center gap-2 border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold px-8 py-3.5 rounded-2xl hover:bg-[#1e3a8a] hover:text-white transition-all duration-300"
          >
            Learn More About Us →
          </a>
        </div>

        <div className="about-right grid grid-cols-2 gap-4">
          {[
            { icon: "📞", title: "Call / WhatsApp", val: "+91 81790 19929" },
            { icon: "✉️", title: "Email",           val: "mklenterprises1247@gmail.com" },
            { icon: "📍", title: "Address",         val: "NAD Junction, Visakhapatnam AP 530027" },
            { icon: "⏰", title: "Hours",            val: "Mon–Sat: 8AM–8PM\nSun: 9AM–5PM" },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-blue-100 hover:border-[#1e3a8a]/30 hover:shadow-lg transition-all">
              <div className="text-2xl mb-3">{c.icon}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{c.title}</div>
              <div className="text-sm font-semibold text-slate-800 whitespace-pre-line">{c.val}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PORTAL BANNER ────────────────────────────────────────────────────────────
function PortalBanner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="group relative bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-3xl p-10 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/30 transition-all hover:-translate-y-1">
            <WaterBlob className="absolute -right-20 -top-20 opacity-20" color="white" size={250} animate={false} />
            <div className="relative z-10">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-2xl font-black text-white mb-3">About Us</h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-6">
                About MKL Enterprises: Vizag&apos;s trusted water purifier experts. Based at NAD Junction,
                we combine expert knowledge with genuine care for every customer.
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-[#1e3a8a] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                Learn More →
              </a>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 overflow-hidden hover:shadow-2xl hover:shadow-black/30 transition-all hover:-translate-y-1">
            <WaterBlob className="absolute -right-20 -top-20 opacity-10" color="#60a5fa" size={250} animate={false} />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-2xl font-black text-white mb-3">Raise a Complaint</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Facing an issue? Submit a complaint and get a unique tracking ID. We resolve within 24 hours.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors text-sm"
              >
                Raise Complaint →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT BAND ─────────────────────────────────────────────────────────────
function ContactBand() {
  return (
    <section className="py-16 bg-[#f1f5f9] border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Still have questions?</h2>
        <p className="text-slate-500 mb-8">Reach us on any channel — we respond fast.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="tel:8179019929" className="flex items-center gap-3 bg-[#1e3a8a] text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20">
            📞 Call Now
          </a>
          <a href="https://wa.me/918179019929" className="flex items-center gap-3 bg-green-500 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-green-600 transition-colors shadow-lg shadow-green-900/20">
            💬 WhatsApp
          </a>
          <a href="mailto:mklenterprises1247@gmail.com" className="flex items-center gap-3 bg-white text-slate-800 border-2 border-slate-200 font-bold px-6 py-3.5 rounded-2xl hover:border-[#1e3a8a] transition-colors">
            ✉️ Email Us
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── FLOATING WHATSAPP ───────────────────────────────────────────────────────
function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href="https://wa.me/918179019929?text=Hi!%20I%20need%20water%20purifier%20service."
      target="_blank"
      rel="noreferrer"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:bg-green-400 hover:scale-110 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      title="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </a>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes ripple {
          from { transform: scale(0); opacity: 1; }
          to   { transform: scale(4); opacity: 0; }
        }
        html { scroll-behavior: smooth; }
        .animate-ripple { animation: ripple 0.7s ease-out forwards; }
      `}</style>

      <Hero />
      <BrandsMarquee />
      <ServicesPreview />
      <HowItWorks />
      <PlansPreview />
      <Testimonials />
      <PortalBanner />
      <EnquiryForm />
      <AboutBand />
      <ContactBand />
      <WhatsAppFloat />
    </>
  );
}