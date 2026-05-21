"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function WaterBlob({
  className = "",
  color = "#1e3a8a",
  opacity = 0.08,
  size = 600,
  animate = true,
}) {
  const blobRef = useRef(null);
  useEffect(() => {
    if (!animate || !blobRef.current) return;
    gsap.to(blobRef.current, {
      attr: {
        d: "M60,0 C93,0 120,27 120,60 C120,93 100,115 60,120 C20,125 0,93 0,60 C0,27 27,0 60,0 Z",
      },
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [animate]);
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
    >
      <path
        ref={blobRef}
        d="M60,0 C95,5 120,30 115,65 C110,100 85,120 50,118 C15,116 0,90 0,60 C0,25 25,-5 60,0 Z"
        fill={color}
        fillOpacity={opacity}
      />
    </svg>
  );
}

function RippleButton({ children, className = "", href, onClick }) {
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top,
      id = Date.now();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    onClick && onClick(e);
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {ripples.map((rp) => (
        <span
          key={rp.id}
          className="absolute rounded-full pointer-events-none"
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

// ── DATA ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "rental",
    icon: "🏠",
    tag: "Most Popular",
    title: "Purifier Rental",
    subtitle: "From ₹399/month",
    tagColor: "bg-blue-100 text-[#1e3a8a]",
    desc: "Our flagship service. Get a premium water purifier at your doorstep with zero upfront cost. All maintenance, repairs, and filter replacements included throughout your rental period.",
    highlights: [
      "Free doorstep delivery & installation",
      "All maintenance included",
      "All filter replacements covered",
      "Free relocation when you move",
      "Upgrade model anytime",
      "No security deposit",
    ],
    cta: "Start Renting",
    href: "/plans",
    featured: true,
  },
  {
    id: "installation",
    icon: "🔩",
    tag: "New Setup",
    title: "New Installation",
    subtitle: "Own your purifier",
    tagColor: "bg-green-100 text-green-700",
    desc: "Purchasing a new purifier? We handle professional installation across all brands — correct wall mounting, pipe fitting, connection testing, and initial water quality check.",
    highlights: [
      "Certified technicians",
      "All brand models",
      "Water quality test included",
      "Same-day availability",
      "Pipe & fitting work",
      "Usage guidance provided",
    ],
    cta: "Book Installation",
    href: "/contact",
    featured: false,
  },
  {
    id: "amc",
    icon: "📋",
    tag: "Annual Contract",
    title: "AMC Plans",
    subtitle: "Peace of mind yearly",
    tagColor: "bg-purple-100 text-purple-700",
    desc: "Annual Maintenance Contracts for purifiers you own. Fixed yearly cost covers all scheduled services, filter checks, and priority support — no surprise bills.",
    highlights: [
      "4 scheduled services/year",
      "All filter checks",
      "Priority technician dispatch",
      "Genuine spare parts",
      "Digital service records",
      "Emergency support included",
    ],
    cta: "View AMC Plans",
    href: "/plans",
    featured: false,
  },
  {
    id: "repair",
    icon: "🛠️",
    tag: "Emergency",
    title: "Repair Service",
    subtitle: "Same-day fixes",
    tagColor: "bg-red-100 text-red-700",
    desc: "Purifier not working? Low flow, bad taste, or complete breakdown — our technicians diagnose and fix all issues the same day using only genuine spare parts.",
    highlights: [
      "Same-day dispatch",
      "All brand models",
      "Genuine OEM parts only",
      "Transparent pricing",
      "90-day repair warranty",
      "WhatsApp job updates",
    ],
    cta: "Book Repair",
    href: "/contact",
    featured: false,
  },
  {
    id: "filter",
    icon: "🔬",
    tag: "Routine Care",
    title: "Filter Replacement",
    subtitle: "Scheduled or on-demand",
    tagColor: "bg-cyan-100 text-cyan-700",
    desc: "Timely filter changes are critical for clean water. We replace all filter types — sediment, carbon, CTO, UF, and RO membrane — with genuine components.",
    highlights: [
      "All filter types covered",
      "Genuine brand filters",
      "Water TDS tested post-change",
      "Scheduled reminders",
      "Doorstep service",
      "Transparent cost breakdown",
    ],
    cta: "Schedule Replacement",
    href: "/contact",
    featured: false,
  },
  {
    id: "sales",
    icon: "🛍️",
    tag: "Purchase",
    title: "Purifier Sales",
    subtitle: "Buy with expert guidance",
    tagColor: "bg-yellow-100 text-yellow-700",
    desc: "Looking to own a purifier? We help you choose the right model based on your water quality, family size, and budget. We stock top brands at competitive prices.",
    highlights: [
      "8+ brands available",
      "TDS-based recommendation",
      "Demo before purchase",
      "Warranty handled",
      "Installation included",
      "After-sale AMC option",
    ],
    cta: "Enquire Now",
    href: "/contact",
    featured: false,
  },
];

const PROCESS = [
  {
    num: "01",
    icon: "📱",
    title: "Book Online or Call",
    desc: "Fill our quick form, call, or WhatsApp us. We confirm within 2 hours.",
  },
  {
    num: "02",
    icon: "🗓️",
    title: "Choose a Time Slot",
    desc: "Pick a convenient slot — morning, afternoon, or evening, any day of the week.",
  },
  {
    num: "03",
    icon: "🏠",
    title: "Technician Arrives",
    desc: "Certified technician comes to your door with all tools and parts needed.",
  },
  {
    num: "04",
    icon: "✅",
    title: "Job Done, Water Tested",
    desc: "Service completed and water quality tested on-site. Digital report sent via WhatsApp.",
  },
];

export default function ServicesPage() {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const processRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".svc-hero-badge",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.5 },
      );
      gsap.fromTo(
        ".svc-hero-title",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.7 },
      );
      gsap.fromTo(
        ".svc-hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.9 },
      );
      gsap.fromTo(
        ".svc-hero-pill",
        { y: 20, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "back.out(1.4)",
          delay: 1.1,
        },
      );
      gsap.to(".svc-blob-1", {
        y: -25,
        x: 10,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".svc-blob-2", {
        y: 20,
        x: -15,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      gsap.fromTo(
        ".svc-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
      gsap.fromTo(
        ".process-step",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: processRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, document.body);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`@keyframes ripple{from{transform:scale(0);opacity:1}to{transform:scale(4);opacity:0}}html{scroll-behavior:smooth}`}</style>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative pt-36 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#0a1628 0%,#1e3a8a 55%,#1e4db7 100%)",
        }}
      >
        <div className="svc-blob-1 absolute -top-24 -right-24 opacity-20 pointer-events-none">
          <WaterBlob color="#60a5fa" opacity={1} size={450} />
        </div>
        <div className="svc-blob-2 absolute -bottom-32 -left-32 opacity-15 pointer-events-none">
          <WaterBlob color="#93c5fd" opacity={1} size={500} />
        </div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z"
              fill="#f1f5f9"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="svc-hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
            <span className="text-blue-200 text-sm font-semibold tracking-wider uppercase">
              Our Services
            </span>
          </div>
          <h1 className="svc-hero-title text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Premium Water
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg,#60a5fa,#93c5fd,#bfdbfe)",
              }}
            >
              Purifier Rentals
            </span>
          </h1>
          <p className="svc-hero-sub text-lg text-blue-200 leading-relaxed mb-10 max-w-2xl mx-auto">
            Rent premium water purifiers with zero upfront cost. Free
            installation, maintenance, and filter replacements. We specialize in
            rentals with comprehensive sales and service support.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Purifier Rental",
              "Installation",
              "AMC Plans",
              "Repair",
              "Filter Replacement",
              "Purifier Sales",
            ].map((pill, i) => (
              <span
                key={i}
                className="svc-hero-pill bg-white/10 border border-white/20 text-blue-100 text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section ref={servicesRef} className="py-24 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Everything Under <span className="text-[#1e3a8a]">One Roof</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Rentals are our primary service — but we are a complete water
              purifier solutions company serving all of Visakhapatnam.
            </p>
          </div>

          {/* Featured rental card */}
          {SERVICES.filter((s) => s.featured).map((s, i) => (
            <div
              key={i}
              className="svc-card mb-6 relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg,#0a1628 0%,#1e3a8a 100%)",
              }}
            >
              <WaterBlob
                className="absolute -right-20 -top-20 opacity-20"
                color="#93c5fd"
                size={350}
                animate={false}
              />
              <div className="relative z-10 p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="inline-block bg-blue-300/20 text-blue-200 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-blue-300/30 mb-4">
                    ⭐ {s.tag}
                  </span>
                  <h3 className="text-4xl font-black text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-blue-300 font-bold text-lg mb-4">
                    {s.subtitle}
                  </p>
                  <p className="text-blue-200 leading-relaxed mb-8">{s.desc}</p>
                  <RippleButton
                    href={s.href}
                    className="inline-flex items-center gap-2 bg-white text-[#1e3a8a] font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/20"
                  >
                    💧 {s.cta}
                  </RippleButton>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {s.highlights.map((h, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-300/30 text-blue-200 flex items-center justify-center text-xs flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-blue-100 text-sm font-medium">
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Other services grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.filter((s) => !s.featured).map((s, i) => (
              <div
                key={i}
                className="svc-card group bg-white rounded-3xl p-8 border border-slate-100 hover:border-[#1e3a8a]/30 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl group-hover:bg-[#1e3a8a] group-hover:scale-110 transition-all duration-300">
                    {s.icon}
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${s.tagColor}`}
                  >
                    {s.tag}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-xl mb-1">
                  {s.title}
                </h3>
                <p className="text-[#1e3a8a] font-bold text-sm mb-3">
                  {s.subtitle}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">
                  {s.desc}
                </p>
                <ul className="space-y-2 mb-6">
                  {s.highlights.slice(0, 4).map((h, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-[#1e3a8a] flex items-center justify-center text-xs flex-shrink-0">
                        ✓
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1 text-[#1e3a8a] font-bold text-sm hover:gap-2 transition-all"
                >
                  {s.cta} →
                </Link>
                <div className="mt-4 h-0.5 rounded-full bg-gradient-to-r from-blue-200 to-[#1e3a8a] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section
        ref={processRef}
        className="py-24 bg-white relative overflow-hidden"
      >
        <WaterBlob
          className="absolute -right-40 top-10 opacity-30"
          color="#dbeafe"
          size={400}
          animate={false}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Book a Service in{" "}
              <span className="text-[#1e3a8a]">4 Simple Steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {PROCESS.map((s, i) => (
              <div key={i} className="process-step relative text-center">
                {i < PROCESS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-3/4 w-full h-px bg-gradient-to-r from-[#1e3a8a]/30 to-blue-200/30 z-0" />
                )}
                <div className="relative z-10">
                  <div className="relative inline-flex mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1e3a8a] to-blue-500 flex items-center justify-center text-3xl shadow-xl shadow-blue-900/20 mx-auto">
                      {s.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] font-black text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Guarantee Banner ── */}
      <section className="py-16 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                icon: "⚡",
                title: "Same-Day Service",
                desc: "Technician dispatched within hours of booking",
              },
              {
                icon: "🔧",
                title: "Genuine Parts Only",
                desc: "OEM and manufacturer-approved components",
              },
              {
                icon: "📋",
                title: "Transparent Pricing",
                desc: "No hidden charges. Quote before we start",
              },
              {
                icon: "🛡️",
                title: "90-Day Warranty",
                desc: "All repairs covered for 90 days post-service",
              },
            ].map((g, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-blue-100 hover:border-[#1e3a8a]/30 hover:shadow-lg transition-all"
              >
                <span className="text-2xl flex-shrink-0">{g.icon}</span>
                <div>
                  <div className="font-bold text-slate-900 text-sm mb-1">
                    {g.title}
                  </div>
                  <div className="text-slate-500 text-xs leading-relaxed">
                    {g.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#0a1628 0%,#1e3a8a 100%)",
        }}
      >
        <WaterBlob
          className="absolute -bottom-20 -right-20 opacity-10"
          color="#93c5fd"
          size={400}
        />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to Book a Service?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            We respond in 2 hours and dispatch same-day. 500+ happy customers
            across Visakhapatnam.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <RippleButton
              href="/plans"
              className="bg-white text-[#1e3a8a] font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/20"
            >
              Rent a Purifier →
            </RippleButton>
            <Link
              href="https://wa.me/918179019929"
              className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 hover:border-white transition-all"
            >
              💬 WhatsApp Us
            </Link>
          </div>
        </div>
      </section>

      <Link
        href="https://wa.me/918179019929?text=Hi!%20I%20need%20water%20purifier%20service."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:bg-green-400 hover:scale-110 transition-all duration-300"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </Link>
    </>
  );
}
