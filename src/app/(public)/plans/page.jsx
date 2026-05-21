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
const RENTAL_PLANS = [
  {
    name: "3 Months",
    price: "₹599",
    period: "/month",
    total: "₹1,797 total",
    saving: null,
    popular: false,
    color: "from-[#1e3a8a] to-blue-600",
    features: [
      { text: "Any 1 Purifier Model", included: true },
      { text: "Free Doorstep Delivery", included: true },
      { text: "Free Installation", included: true },
      { text: "Scheduled Maintenance", included: true },
      { text: "Filter Replacements", included: true },
      { text: "Repair Coverage", included: true },
      { text: "Phone & WhatsApp Support", included: true },
      { text: "Free Relocation", included: false },
      { text: "Priority Dispatch", included: false },
      { text: "24/7 Emergency Support", included: false },
    ],
  },
  {
    name: "6 Months",
    price: "₹499",
    period: "/month",
    total: "₹2,994 total",
    saving: "Save ₹600",
    popular: true,
    color: "from-[#0a1628] to-[#1e3a8a]",
    features: [
      { text: "Any 1 Purifier Model", included: true },
      { text: "Free Doorstep Delivery", included: true },
      { text: "Free Installation", included: true },
      { text: "Scheduled Maintenance", included: true },
      { text: "Filter Replacements", included: true },
      { text: "Repair Coverage", included: true },
      { text: "Priority WhatsApp Support", included: true },
      { text: "Free Relocation", included: true },
      { text: "Priority Dispatch", included: true },
      { text: "24/7 Emergency Support", included: false },
    ],
  },
  {
    name: "12 Months",
    price: "₹399",
    period: "/month",
    total: "₹4,788 total",
    saving: "Save ₹2,400",
    popular: false,
    color: "from-slate-800 to-slate-900",
    features: [
      { text: "Any 1 Purifier Model", included: true },
      { text: "Free Doorstep Delivery", included: true },
      { text: "Free Installation", included: true },
      { text: "Scheduled Maintenance", included: true },
      { text: "All Filter Types Covered", included: true },
      { text: "Full Repair Coverage", included: true },
      { text: "24/7 Emergency Support", included: true },
      { text: "Free Relocation", included: true },
      { text: "Priority Dispatch", included: true },
      { text: "Membrane Replacement Covered", included: true },
    ],
  },
];

const AMC_PLANS = [
  {
    name: "Basic AMC",
    price: "₹1,499",
    period: "/year",
    desc: "For purifiers under 3 years old",
    features: [
      "2 scheduled services",
      "Filter check & clean",
      "All brand models",
      "Phone support",
      "Genuine parts used",
    ],
    popular: false,
  },
  {
    name: "Standard AMC",
    price: "₹2,499",
    period: "/year",
    desc: "Best for 3–5 year old purifiers",
    features: [
      "4 scheduled services",
      "All filter replacements",
      "Priority dispatch",
      "1 free repair visit",
      "Digital service reports",
      "WhatsApp support",
    ],
    popular: true,
  },
  {
    name: "Premium AMC",
    price: "₹3,999",
    period: "/year",
    desc: "Comprehensive coverage, all ages",
    features: [
      "6 scheduled services",
      "All filters + membrane",
      "Unlimited repair visits",
      "24/7 emergency support",
      "Spare parts covered",
      "Free water quality tests",
    ],
    popular: false,
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Monthly Cost",
    rental: "₹399–₹599/mo",
    owning: "₹0 (post-purchase)",
  },
  { feature: "Upfront Cost", rental: "₹0", owning: "₹8,000–₹25,000" },
  { feature: "Installation", rental: "Free", owning: "₹500–₹1,500" },
  {
    feature: "Filter Changes (annual)",
    rental: "Included",
    owning: "₹2,000–₹5,000",
  },
  { feature: "Repairs", rental: "Included", owning: "₹500–₹5,000 per call" },
  { feature: "Relocation", rental: "Free", owning: "₹500–₹1,000" },
  {
    feature: "Model Upgrade",
    rental: "Anytime, free",
    owning: "Buy new purifier",
  },
  {
    feature: "Annual Total (approx)",
    rental: "₹4,788–₹7,188",
    owning: "₹12,000–₹35,000 (yr 1)",
  },
];

export default function PlansPage() {
  const heroRef = useRef(null);
  const rentalRef = useRef(null);
  const amcRef = useRef(null);
  const compareRef = useRef(null);
  const [activeTab, setActiveTab] = useState("rental");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".plans-hero-badge",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.5 },
      );
      gsap.fromTo(
        ".plans-hero-title",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.7 },
      );
      gsap.fromTo(
        ".plans-hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.9 },
      );
      gsap.to(".plans-blob-1", {
        y: -20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        ".rental-card",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: rentalRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
      gsap.fromTo(
        ".amc-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: amcRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
      gsap.fromTo(
        ".compare-row",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: compareRef.current,
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
        <div className="plans-blob-1 absolute -top-24 -right-24 opacity-20 pointer-events-none">
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

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="plans-hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
            <span className="text-blue-200 text-sm font-semibold tracking-wider uppercase">
              Transparent Pricing
            </span>
          </div>
          <h1 className="plans-hero-title text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Simple, Honest
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg,#60a5fa,#93c5fd,#bfdbfe)",
              }}
            >
              Plans & Pricing
            </span>
          </h1>
          <p className="plans-hero-sub text-lg text-blue-200 leading-relaxed">
            No hidden fees. No surprises. Just clean water at a fixed monthly
            cost — with everything included.
          </p>
        </div>
      </section>

      {/* ── Tab Toggle ── */}
      <section className="bg-[#f1f5f9] pt-16 pb-4">
        <div className="max-w-xs mx-auto px-6">
          <div className="flex bg-white rounded-2xl p-1.5 border border-blue-100 shadow-sm">
            <button
              onClick={() => setActiveTab("rental")}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "rental" ? "bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/30" : "text-slate-500 hover:text-[#1e3a8a]"}`}
            >
              Rental Plans
            </button>
            <button
              onClick={() => setActiveTab("amc")}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "amc" ? "bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/30" : "text-slate-500 hover:text-[#1e3a8a]"}`}
            >
              AMC Plans
            </button>
          </div>
        </div>
      </section>

      {/* ── Rental Plans ── */}
      {activeTab === "rental" && (
        <section ref={rentalRef} className="pb-24 bg-[#f1f5f9]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 pt-12">
              <h2 className="text-4xl font-black text-slate-900 mb-3">
                Water Purifier{" "}
                <span className="text-[#1e3a8a]">Rental Plans</span>
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                All plans include free installation, all maintenance, filter
                replacements, and repairs. Choose longer for bigger savings.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {RENTAL_PLANS.map((plan, i) => (
                <div
                  key={i}
                  className={`rental-card relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-3 ${plan.popular ? "ring-2 ring-blue-300 ring-offset-4 ring-offset-[#f1f5f9] md:-mt-4" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute top-4 right-4 bg-blue-300 text-[#1e3a8a] text-xs font-black px-3 py-1 rounded-full z-10">
                      ⭐ Most Popular
                    </div>
                  )}
                  {plan.saving && (
                    <div className="absolute top-4 left-4 bg-green-400 text-green-900 text-xs font-black px-3 py-1 rounded-full z-10">
                      {plan.saving}
                    </div>
                  )}

                  <div className={`bg-gradient-to-br ${plan.color} p-8`}>
                    <h3 className="font-black text-xl text-white mb-1">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl font-black text-white">
                        {plan.price}
                      </span>
                      <span className="text-blue-200 text-sm">
                        {plan.period}
                      </span>
                    </div>
                    <div className="text-blue-300/70 text-xs font-medium mb-6">
                      {plan.total}
                    </div>
                    <RippleButton
                      href="/contact"
                      className="w-full py-3.5 bg-white text-[#1e3a8a] font-bold rounded-2xl hover:bg-blue-50 transition-colors text-sm text-center block shadow-lg shadow-black/10"
                    >
                      Get Started →
                    </RippleButton>
                  </div>

                  <div className="bg-white p-8">
                    <ul className="space-y-3">
                      {plan.features.map((f, j) => (
                        <li
                          key={j}
                          className={`flex items-center gap-3 text-sm ${f.included ? "text-slate-700" : "text-slate-300"}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold ${f.included ? "bg-[#1e3a8a] text-white" : "bg-slate-100 text-slate-300"}`}
                          >
                            {f.included ? "✓" : "✕"}
                          </span>
                          {f.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-400 text-sm mt-8">
              All plans · Free doorstep delivery · Genuine spare parts ·
              Certified technicians · Servicing Vizag since 2018
            </p>
          </div>
        </section>
      )}

      {/* ── AMC Plans ── */}
      {activeTab === "amc" && (
        <section ref={amcRef} className="pb-24 bg-[#f1f5f9]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 pt-12">
              <h2 className="text-4xl font-black text-slate-900 mb-3">
                Annual Maintenance{" "}
                <span className="text-[#1e3a8a]">Contract Plans</span>
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Own a purifier? Keep it running perfectly with our AMC plans.
                Fixed yearly cost, zero surprise bills, priority service.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {AMC_PLANS.map((plan, i) => (
                <div
                  key={i}
                  className={`amc-card relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${plan.popular ? "ring-2 ring-blue-300 ring-offset-4 ring-offset-[#f1f5f9]" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute top-4 right-4 bg-blue-300 text-[#1e3a8a] text-xs font-black px-3 py-1 rounded-full z-10">
                      Most Popular
                    </div>
                  )}
                  <div
                    className={`p-8 ${plan.popular ? "bg-[#1e3a8a]" : "bg-white border border-slate-100"}`}
                  >
                    <h3
                      className={`font-black text-xl mb-1 ${plan.popular ? "text-white" : "text-slate-900"}`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-sm mb-4 ${plan.popular ? "text-blue-200" : "text-slate-400"}`}
                    >
                      {plan.desc}
                    </p>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span
                        className={`text-4xl font-black ${plan.popular ? "text-white" : "text-[#1e3a8a]"}`}
                      >
                        {plan.price}
                      </span>
                      <span
                        className={`text-sm ${plan.popular ? "text-blue-200" : "text-slate-400"}`}
                      >
                        {plan.period}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f, j) => (
                        <li
                          key={j}
                          className={`flex items-center gap-3 text-sm ${plan.popular ? "text-blue-100" : "text-slate-600"}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${plan.popular ? "bg-white/20 text-white" : "bg-blue-100 text-[#1e3a8a]"}`}
                          >
                            ✓
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <RippleButton
                      href="/contact"
                      className={`w-full py-3.5 font-bold rounded-2xl text-sm text-center block transition-colors ${plan.popular ? "bg-white text-[#1e3a8a] hover:bg-blue-50 shadow-lg" : "bg-[#1e3a8a] text-white hover:bg-blue-800"}`}
                    >
                      Get AMC →
                    </RippleButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Rent vs Own Comparison ── */}
      <section ref={compareRef} className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Cost Analysis
            </span>
            <h2 className="text-4xl font-black text-slate-900">
              Renting vs <span className="text-[#1e3a8a]">Buying</span>
            </h2>
            <p className="text-slate-500 mt-3">
              See the real numbers — renting is almost always smarter in the
              first 2 years.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-[#1e3a8a] text-white text-sm font-bold">
              <div className="p-4">Feature</div>
              <div className="p-4 text-center border-l border-white/10 text-blue-300">
                🏠 Renting (MKL)
              </div>
              <div className="p-4 text-center border-l border-white/10">
                💰 Buying (own)
              </div>
            </div>
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={i}
                className={`compare-row grid grid-cols-3 text-sm border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}
              >
                <div className="p-4 font-semibold text-slate-700">
                  {row.feature}
                </div>
                <div className="p-4 text-center border-l border-slate-100">
                  <span className="inline-block bg-blue-100 text-[#1e3a8a] font-bold px-3 py-1 rounded-lg text-xs">
                    {row.rental}
                  </span>
                </div>
                <div className="p-4 text-center border-l border-slate-100 text-slate-500 font-medium">
                  {row.owning}
                </div>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-xs text-center mt-4">
            * Owning costs are estimates based on average market prices. Actual
            costs may vary by brand and model.
          </p>
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
            Still Deciding?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            WhatsApp us and we will help you choose the best plan for your needs
            — no pressure, no sales pitch.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="https://wa.me/918179019929?text=Hi!%20I%20want%20to%20know%20more%20about%20your%20rental%20plans."
              className="flex items-center gap-2 bg-green-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-green-600 transition-colors shadow-xl"
            >
              💬 WhatsApp to Discuss
            </Link>
            <Link
              href="tel:8179019929"
              className="flex items-center gap-2 bg-white text-[#1e3a8a] font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-xl shadow-black/20"
            >
              📞 Call Now
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
