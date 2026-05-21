"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

function RippleButton({ children, className = "", href }) {
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top,
      id = Date.now();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
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
const BRANDS = [
  {
    name: "Kent",
    icon: "💧",
    badge: "Top Rented",
    badgeColor: "bg-blue-100 text-[#1e3a8a]",
    tagline: "India's #1 RO Brand",
    desc: "Kent purifiers are known for their mineral ROTM technology that retains natural minerals while removing impurities. A top choice for Vizag's hard water.",
    types: ["RO", "RO+UV", "RO+UV+UF", "Alkaline RO"],
    rentalFrom: "₹449/mo",
    tds: "High TDS water",
    features: [
      "Mineral ROTM tech",
      "Zero Water Wastage models",
      "Smart TDS control",
      "Wall-mount & counter-top",
    ],
  },
  {
    name: "Aquaguard",
    icon: "🌊",
    badge: "Most Trusted",
    badgeColor: "bg-green-100 text-green-700",
    tagline: "Eureka Forbes Legacy",
    desc: "Aquaguard by Eureka Forbes has been trusted by Indian families for decades. Features intelligent purification that adapts to your water source automatically.",
    types: ["RO+UV+MTDS", "UV+UF", "RO+UV", "Smart Water"],
    rentalFrom: "₹499/mo",
    tds: "Mixed water sources",
    features: [
      "Intelligent purification",
      "Auto source detection",
      "Aquacheck technology",
      "Ionic Silver protection",
    ],
  },
  {
    name: "Livpure",
    icon: "💦",
    badge: "Best Value",
    badgeColor: "bg-yellow-100 text-yellow-700",
    tagline: "Smart & Affordable",
    desc: "Livpure offers high-performance purification at competitive prices. Their Glo and Bolt series are popular rental choices for Vizag families who want quality without premium pricing.",
    types: ["RO+UV", "RO+UV+UF", "Gravity", "Smart RO"],
    rentalFrom: "₹399/mo",
    tds: "Medium to high TDS",
    features: [
      "8-stage purification",
      "Smart LED indicators",
      "1-year membrane warranty",
      "Copper & Zinc infusion models",
    ],
  },
  {
    name: "Pureit",
    icon: "🫧",
    badge: "HUL Brand",
    badgeColor: "bg-purple-100 text-purple-700",
    tagline: "Hindustan Unilever",
    desc: "Pureit by HUL is one of India's most recognized purifier brands. Known for their Advanced RO series with auto-shut off when purification is compromised.",
    types: ["RO+UV+MF", "Advanced RO", "Eco Water Saver", "Classic UV"],
    rentalFrom: "₹449/mo",
    tds: "All water types",
    features: [
      "Auto-shut off safety",
      "ECO Water Saver 60%",
      "FiltraPower technology",
      "Advanced Alert system",
    ],
  },
  {
    name: "Bluestar",
    icon: "🌊",
    badge: "Commercial Grade",
    badgeColor: "bg-cyan-100 text-cyan-700",
    tagline: "Industrial Strength",
    desc: "Bluestar brings commercial-grade purification to homes. Known for their Majesto and Aristo series that handle extremely high TDS water common in industrial areas of Vizag.",
    types: ["RO+UV+UF", "RO+UV+CO2", "Counter-top", "Under-sink"],
    rentalFrom: "₹499/mo",
    tds: "Very high TDS areas",
    features: [
      "SS food grade tank",
      "High TDS rejection",
      "8L storage tank",
      "No electricity models",
    ],
  },
  {
    name: "Bpure",
    icon: "💦",
    badge: "Emerging Brand",
    badgeColor: "bg-orange-100 text-orange-700",
    tagline: "Modern Purification",
    desc: "Bpure offers contemporary designs with advanced purification stages. A great option for renters who want a modern-looking purifier with reliable performance.",
    types: ["RO+UV", "RO+UV+UF", "Alkaline", "TDS Control"],
    rentalFrom: "₹399/mo",
    tds: "Medium TDS water",
    features: [
      "7-stage filtration",
      "Alkaline water option",
      "Compact wall-mount",
      "Transparent tank",
    ],
  },
  {
    name: "LG",
    icon: "💧",
    badge: "Premium Tech",
    badgeColor: "bg-red-100 text-red-700",
    tagline: "Innovation Leader",
    desc: "LG PuriCare combines Korean technology with stylish design. Their dual protection filter and stainless steel tank make it a premium rental choice for discerning customers.",
    types: ["RO+UV", "RO+UV+UF", "Under-sink", "PuriCare 360°"],
    rentalFrom: "₹549/mo",
    tds: "All TDS ranges",
    features: [
      "Dual protection filter",
      "SS hygienic tank",
      "ThinQ smart features",
      "True auto-cleaning",
    ],
  },
  {
    name: "Whirlpool",
    icon: "🫧",
    badge: "Reliable Choice",
    badgeColor: "bg-indigo-100 text-indigo-700",
    tagline: "Global Trust",
    desc: "Whirlpool's Purafresh range delivers consistent purification with minimal maintenance. Backed by a global brand's service network, ideal for families wanting hassle-free rentals.",
    types: ["RO+UV+UF", "RO+UV", "Wall-mount", "Counter-top"],
    rentalFrom: "₹449/mo",
    tds: "Medium to high TDS",
    features: [
      "6-stage purification",
      "10L+ storage",
      "Pre-filter included",
      "Energy efficient motor",
    ],
  },
];

const FILTER_TYPES = [
  "All",
  "Best for High TDS",
  "Budget-Friendly",
  "Premium Tech",
  "Commercial Grade",
];

export default function BrandsPage() {
  const heroRef = useRef(null);
  const brandsRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".brand-hero-badge",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.5 },
      );
      gsap.fromTo(
        ".brand-hero-title",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.7 },
      );
      gsap.fromTo(
        ".brand-hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.9 },
      );
      gsap.to(".brand-blob-1", {
        y: -25,
        x: 10,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        ".brand-card",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: brandsRef.current,
            start: "top 80%",
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
        <div className="brand-blob-1 absolute -top-24 -right-24 opacity-20 pointer-events-none">
          <WaterBlob color="#60a5fa" opacity={1} size={450} />
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
          <div className="brand-hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
            <span className="text-blue-200 text-sm font-semibold tracking-wider uppercase">
              8+ Authorized Brands
            </span>
          </div>
          <h1 className="brand-hero-title text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Rent Any Brand.
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg,#60a5fa,#93c5fd,#bfdbfe)",
              }}
            >
              One Trusted Partner.
            </span>
          </h1>
          <p className="brand-hero-sub text-lg text-blue-200 leading-relaxed max-w-2xl mx-auto">
            We&apos;re authorized service partners for all major water purifier
            brands. Rent the model you want — we handle everything from delivery
            to maintenance.
          </p>
        </div>
      </section>

      {/* ── Brands Grid ── */}
      <section ref={brandsRef} className="py-24 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Available Brands
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Choose Your <span className="text-[#1e3a8a]">Purifier Brand</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Not sure which brand suits your water? Our technician will test
              your TDS and recommend the best model for free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRANDS.map((brand, i) => (
              <div
                key={i}
                className="brand-card group bg-white rounded-3xl border border-slate-100 hover:border-[#1e3a8a]/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
                onClick={() =>
                  setSelectedBrand(
                    selectedBrand?.name === brand.name ? null : brand,
                  )
                }
              >
                {/* Card header */}
                <div
                  className="relative p-6 pb-4"
                  style={{
                    background:
                      "linear-gradient(135deg,#0a1628 0%,#1e3a8a 100%)",
                  }}
                >
                  <WaterBlob
                    className="absolute -right-8 -top-8 opacity-20"
                    color="white"
                    size={120}
                    animate={false}
                  />
                  <div className="relative z-10 flex items-start justify-between mb-3">
                    <div className="text-4xl">{brand.icon}</div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${brand.badgeColor}`}
                    >
                      {brand.badge}
                    </span>
                  </div>
                  <h3 className="relative z-10 text-white font-black text-xl">
                    {brand.name}
                  </h3>
                  <p className="relative z-10 text-blue-300 text-xs font-semibold">
                    {brand.tagline}
                  </p>
                </div>

                {/* Card body */}
                <div className="p-6">
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {brand.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {brand.types.slice(0, 3).map((t, j) => (
                      <span
                        key={j}
                        className="bg-blue-50 text-[#1e3a8a] text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-100"
                      >
                        {t}
                      </span>
                    ))}
                    {brand.types.length > 3 && (
                      <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        +{brand.types.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">
                        Rental from
                      </div>
                      <div className="text-[#1e3a8a] font-black text-lg">
                        {brand.rentalFrom}
                      </div>
                    </div>
                    <button
                      className={`text-xs font-bold transition-all ${selectedBrand?.name === brand.name ? "text-[#1e3a8a]" : "text-slate-400 group-hover:text-[#1e3a8a]"}`}
                    >
                      {selectedBrand?.name === brand.name
                        ? "▲ Less"
                        : "Details ▼"}
                    </button>
                  </div>

                  {/* Expanded details */}
                  {selectedBrand?.name === brand.name && (
                    <div className="mt-4 pt-4 border-t border-slate-100 animate-slide-up">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Key Features
                      </div>
                      <ul className="space-y-1.5 mb-4">
                        {brand.features.map((f, j) => (
                          <li
                            key={j}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <span className="w-4 h-4 rounded-full bg-blue-100 text-[#1e3a8a] flex items-center justify-center text-xs flex-shrink-0">
                              ✓
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="bg-blue-50 rounded-xl p-3 mb-4">
                        <div className="text-xs font-bold text-[#1e3a8a] mb-0.5">
                          Best For
                        </div>
                        <div className="text-sm text-slate-600">
                          {brand.tds}
                        </div>
                      </div>
                      <RippleButton
                        href="/contact"
                        className="w-full py-2.5 bg-[#1e3a8a] text-white font-bold rounded-xl text-sm hover:bg-blue-800 transition-colors text-center block"
                      >
                        Rent {brand.name} →
                      </RippleButton>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we choose section ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <WaterBlob
          className="absolute -left-40 bottom-0 opacity-30"
          color="#dbeafe"
          size={400}
          animate={false}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Expert Guidance
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Not Sure Which{" "}
              <span className="text-[#1e3a8a]">Brand to Pick?</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              Our technician does a free water TDS test at your home and
              recommends the best model for your specific water conditions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🧪",
                title: "Free TDS Test",
                desc: "We test your water's TDS level, hardness, and contamination before recommending any model.",
                step: "Step 1",
              },
              {
                icon: "📊",
                title: "Brand Matching",
                desc: "Based on test results, we match you with the brand and purification type (RO, UV, UF) best suited for your water.",
                step: "Step 2",
              },
              {
                icon: "🎯",
                title: "Model Demo",
                desc: "We show you the recommended model in action, explain features, and confirm it meets your needs before you commit.",
                step: "Step 3",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-[#f1f5f9] rounded-3xl p-8 border border-blue-100 hover:border-[#1e3a8a]/30 hover:shadow-lg transition-all"
              >
                <div className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest mb-3">
                  {s.step}
                </div>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-black text-slate-900 text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <RippleButton
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/30"
            >
              💧 Get Free TDS Test & Recommendation
            </RippleButton>
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
            Ready to Rent Your Purifier?
          </h2>
          <p className="text-blue-200 mb-8">
            All 8 brands available for rental. Free installation. Zero
            maintenance cost. Starting ₹399/month.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <RippleButton
              href="/plans"
              className="bg-white text-[#1e3a8a] font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/20"
            >
              View Rental Plans →
            </RippleButton>
            <a
              href="https://wa.me/918179019929"
              className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 hover:border-white transition-all"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/918179019929?text=Hi!%20I%20need%20water%20purifier%20service."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:bg-green-400 hover:scale-110 transition-all duration-300"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </>
  );
}
