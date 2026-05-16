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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 },
    );
  }, []);
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Brands", href: "/brands" },
    { label: "Plans", href: "/plans" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact", href: "/contact" },
  ];
  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-blue-900/8 border-b border-blue-100" : "bg-transparent"}`}
    >
      <div className="bg-[#1e3a8a] text-white text-xs py-2 px-6 flex justify-between items-center">
        <span className="opacity-80">
          🎉 Free Installation across Visakhapatnam & surrounding areas
        </span>
        <div className="flex items-center gap-4 opacity-90">
          <a href="tel:8179019929" className="hover:opacity-100">
            📞 +91 81790 19929
          </a>
          <span>|</span>
          <a href="https://wa.me/918179019929" className="hover:opacity-100">
            💬 WhatsApp
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-[#1e3a8a] rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-blue-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">MKL</span>
            </div>
          </div>
          <div>
            <div
              className={`font-black text-lg leading-none tracking-tight transition-colors ${scrolled ? "text-[#1e3a8a]" : "text-white"}`}
            >
              MKL Enterprises
            </div>
            <div
              className={`text-xs font-medium tracking-widest uppercase transition-colors ${scrolled ? "text-blue-400" : "text-blue-200"}`}
            >
              Premium Rentals
            </div>
          </div>
        </a>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-blue-50 hover:text-[#1e3a8a] ${scrolled ? "text-slate-700" : "text-white/90 hover:text-[#1e3a8a]"}`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <RippleButton
            href="/contact"
            className="bg-[#1e3a8a] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/30"
          >
            Book Now
          </RippleButton>
        </div>
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""} ${scrolled ? "bg-slate-800" : "bg-white"}`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""} ${scrolled ? "bg-slate-800" : "bg-white"}`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""} ${scrolled ? "bg-slate-800" : "bg-white"}`}
          />
        </button>
      </div>
      <div
        className={`md:hidden bg-white border-t border-blue-100 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-slate-700 font-semibold py-2.5 border-b border-slate-100 hover:text-[#1e3a8a]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#0a1628" }}>
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-[#1e3a8a] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xs">MKL</span>
            </div>
            <span className="text-white font-black text-base">
              MKL Enterprises
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Visakhapatnam's #1 water purifier rental service with sales and
            maintenance support.
          </p>
          <a
            href="tel:8179019929"
            className="text-blue-400 font-bold text-sm hover:text-blue-300"
          >
            +91 81790 19929
          </a>
        </div>
        {[
          {
            title: "Pages",
            links: [
              ["Home", "/"],
              ["About Us", "/about"],
              ["Services", "/services"],
              ["Contact", "/contact"],
            ],
          },
          {
            title: "Rentals",
            links: [
              ["3-Month Plan", "/plans"],
              ["6-Month Plan", "/plans"],
              ["12-Month Plan", "/plans"],
              ["All Brands", "/brands"],
            ],
          },
          {
            title: "Support",
            links: [
              ["FAQs", "/faqs"],
              ["How It Works", "/how-it-works"],
              ["Why Choose Us", "/why-choose-us"],
              ["Raise Complaint", "/complaint"],
            ],
          },
        ].map((col, i) => (
          <div key={i}>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-slate-400 text-sm hover:text-blue-400 transition-colors font-medium"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <span>
            © 2026 MKL Enterprises. All rights reserved. · NAD Junction,
            Visakhapatnam AP 530027
          </span>
        </div>
      </div>
    </footer>
  );
}

// ── FAQ DATA ─────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    category: "Rental Basics",
    icon: "📋",
    faqs: [
      {
        q: "How does the water purifier rental work?",
        a: "It's simple: you choose a plan (3, 6, or 12 months), we deliver and install a brand-new purifier at your home for free, and you pay a fixed monthly rental. We handle all maintenance, filter changes, and repairs throughout your rental period — at zero extra cost.",
      },
      {
        q: "What's included in the rental price?",
        a: "Everything. Free doorstep delivery, installation, regular scheduled maintenance, filter replacements (carbon, CTO, membrane — all types), repairs in case of breakdown, and free relocation if you move. The monthly rental is the only thing you pay.",
      },
      {
        q: "Do I need to pay a security deposit?",
        a: "No security deposit is required for our standard rental plans. We trust our customers. Just the monthly rental — that's it.",
      },
      {
        q: "Can I cancel the rental before the plan ends?",
        a: "Yes, you can cancel anytime. There are no lock-in penalties. We'll arrange a pick-up at your convenience. Note that pre-paid months are non-refundable, so we recommend choosing your plan duration wisely.",
      },
      {
        q: "Can I upgrade or switch my purifier model mid-rental?",
        a: "Absolutely. You can request a model upgrade anytime during your rental period. If a newer or better-suited model is available, we'll swap it out — no extra charges for the swap itself.",
      },
    ],
  },
  {
    category: "Installation & Delivery",
    icon: "🚿",
    faqs: [
      {
        q: "How quickly will my purifier be installed?",
        a: "We aim for same-day installation. Once you book, our team calls you within 2 hours to confirm a time slot. In most cases, your purifier is installed the same day or the next morning.",
      },
      {
        q: "Is installation really free?",
        a: "Yes. Doorstep delivery and complete installation — including mounting, pipe fitting, and a water quality test — are 100% free with every rental plan.",
      },
      {
        q: "Which areas in Visakhapatnam do you cover?",
        a: "We cover 200+ areas across Visakhapatnam including MVP Colony, Maddilapalem, Gajuwaka, NAD Junction, Dwaraka Nagar, Steel Plant, Rushikonda, and many more. Contact us if your area isn't listed — we likely cover it.",
      },
      {
        q: "What if I move to a different area?",
        a: "No problem. We'll pick up the purifier from your old address and reinstall it at your new one — completely free. Just inform us at least 48 hours in advance.",
      },
    ],
  },
  {
    category: "Maintenance & Repairs",
    icon: "🔧",
    faqs: [
      {
        q: "How often is the purifier serviced?",
        a: "We conduct scheduled maintenance every 3 months as part of your rental. We'll proactively reach out to book a service visit. You never have to chase us for it.",
      },
      {
        q: "What if my purifier breaks down?",
        a: "Call or WhatsApp us immediately. We dispatch a technician the same day at no charge. All repairs — including parts replacement — are fully covered under your rental.",
      },
      {
        q: "Are filter replacements really included?",
        a: "Yes, all filter types are covered — sediment filter, carbon block, CTO, UF membrane, and RO membrane. We replace them on schedule and at no extra cost.",
      },
      {
        q: "Do you use genuine spare parts?",
        a: "Always. We use only OEM or manufacturer-approved genuine parts for every service and repair. Never third-party or duplicate components.",
      },
    ],
  },
  {
    category: "Billing & Payments",
    icon: "💳",
    faqs: [
      {
        q: "How and when do I pay?",
        a: "Payments are monthly, collected at the start of each rental month. We accept UPI, bank transfer, and cash. You'll receive a digital receipt for every payment via WhatsApp.",
      },
      {
        q: "Can I pay all months in advance?",
        a: "Yes, and we offer a small discount for upfront payment of the full tenure. Ask our team for current offers when you book.",
      },
      {
        q: "Are there any hidden charges?",
        a: "None whatsoever. The rental price is all-inclusive. No service call charges, no filter replacement fees, no travel charges — nothing beyond the monthly rental.",
      },
    ],
  },
  {
    category: "Brands & Models",
    icon: "🏆",
    faqs: [
      {
        q: "Which brands are available for rental?",
        a: "We offer purifiers from 8+ major brands: Kent, Aquaguard, Livpure, Pureit, Bluestar, Bpure, LG, and Whirlpool. Model availability may vary — contact us to check current stock.",
      },
      {
        q: "Which purifier is best for my water type?",
        a: "It depends on your TDS level and water source. When you book, our technician will test your water and recommend the best model — RO, UV, RO+UV, or RO+UV+UF — based on your specific water quality.",
      },
      {
        q: "Can I request a specific brand or model?",
        a: "Yes. When booking, mention your preferred brand or model. We'll do our best to accommodate it. If unavailable, we'll recommend the closest equivalent.",
      },
    ],
  },
];

function AccordionItem({ q, a, isOpen, onToggle }) {
  const contentRef = useRef(null);
  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      gsap.to(contentRef.current, {
        height: "auto",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(contentRef.current, { opacity: 1, duration: 0.3, delay: 0.1 });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.3,
        ease: "power3.in",
      });
      gsap.to(contentRef.current, { opacity: 0, duration: 0.2 });
    }
  }, [isOpen]);
  return (
    <div
      className={`border-b border-slate-100 last:border-0 transition-colors ${isOpen ? "bg-blue-50/50" : "bg-white hover:bg-slate-50/50"}`}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={onToggle}
      >
        <span
          className={`font-bold text-base transition-colors ${isOpen ? "text-[#1e3a8a]" : "text-slate-800"}`}
        >
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#1e3a8a] text-white rotate-45" : "bg-blue-100 text-[#1e3a8a]"}`}
        >
          +
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ height: 0, overflow: "hidden", opacity: 0 }}
      >
        <div className="px-6 pb-5">
          <p className="text-slate-600 leading-relaxed text-sm">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");
  const heroRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-hero-badge",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.5 },
      );
      gsap.fromTo(
        ".faq-hero-title",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.7 },
      );
      gsap.fromTo(
        ".faq-hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.9 },
      );
      gsap.fromTo(
        ".faq-hero-search",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 1.1 },
      );
      gsap.to(".faq-blob-1", {
        y: -20,
        x: 10,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, document.body);
    return () => ctx.revert();
  }, []);

  // Filter across all categories when searching
  const allFaqs = FAQ_CATEGORIES.flatMap((cat, ci) =>
    cat.faqs.map((f, fi) => ({
      ...f,
      catIndex: ci,
      catName: cat.category,
      catIcon: cat.icon,
      fiIndex: fi,
    })),
  );
  const filtered =
    search.trim().length > 1
      ? allFaqs.filter(
          (f) =>
            f.q.toLowerCase().includes(search.toLowerCase()) ||
            f.a.toLowerCase().includes(search.toLowerCase()),
        )
      : null;

  const handleToggle = (key) => setOpenIndex(openIndex === key ? null : key);

  return (
    <>
      <style>{`@keyframes ripple { from{transform:scale(0);opacity:1} to{transform:scale(4);opacity:0} } html{scroll-behavior:smooth}`}</style>
      <Navbar />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative pt-36 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#0a1628 0%,#1e3a8a 55%,#1e4db7 100%)",
        }}
      >
        <div className="faq-blob-1 absolute -top-24 -right-24 opacity-20 pointer-events-none">
          <WaterBlob color="#60a5fa" opacity={1} size={400} />
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
          <div className="faq-hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
            <span className="text-blue-200 text-sm font-semibold tracking-wider uppercase">
              Help Center
            </span>
          </div>
          <h1 className="faq-hero-title text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Frequently Asked
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg,#60a5fa,#93c5fd)",
              }}
            >
              Questions
            </span>
          </h1>
          <p className="faq-hero-sub text-lg text-blue-200 mb-10">
            Everything you need to know about renting a water purifier from MKL.
            Can't find your answer? WhatsApp us.
          </p>

          {/* Search */}
          <div className="faq-hero-search relative max-w-xl mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your question..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent focus:border-[#1e3a8a] focus:outline-none text-slate-800 font-medium bg-white shadow-2xl shadow-black/20 text-base"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ Body ── */}
      <section ref={faqRef} className="py-24 bg-[#f1f5f9]">
        <div className="max-w-5xl mx-auto px-6">
          {filtered ? (
            /* Search results */
            <div>
              <p className="text-slate-500 text-sm mb-8 font-semibold">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
                <span className="text-[#1e3a8a]">{search}</span>"
              </p>
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-black text-slate-700 mb-2">
                    No results found
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Try a different search term or contact us directly.
                  </p>
                  <a
                    href="https://wa.me/918179019929"
                    className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors"
                  >
                    💬 Ask on WhatsApp
                  </a>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                  {filtered.map((f, i) => (
                    <div key={i}>
                      <div className="px-6 pt-4 pb-1">
                        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-[#1e3a8a] text-xs font-bold px-3 py-1 rounded-full">
                          {f.catIcon} {f.catName}
                        </span>
                      </div>
                      <AccordionItem
                        q={f.q}
                        a={f.a}
                        isOpen={openIndex === `s-${i}`}
                        onToggle={() => handleToggle(`s-${i}`)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Category tabs */
            <div>
              {/* Category selector */}
              <div className="flex flex-wrap gap-3 mb-10">
                {FAQ_CATEGORIES.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveCategory(i);
                      setOpenIndex(null);
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 ${activeCategory === i ? "bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/30" : "bg-white text-slate-600 border border-slate-200 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"}`}
                  >
                    <span>{cat.icon}</span>
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* Active category FAQs */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                  <span className="text-2xl">
                    {FAQ_CATEGORIES[activeCategory].icon}
                  </span>
                  <h2 className="font-black text-xl text-slate-900">
                    {FAQ_CATEGORIES[activeCategory].category}
                  </h2>
                  <span className="ml-auto bg-blue-100 text-[#1e3a8a] text-xs font-bold px-3 py-1 rounded-full">
                    {FAQ_CATEGORIES[activeCategory].faqs.length} questions
                  </span>
                </div>
                {FAQ_CATEGORIES[activeCategory].faqs.map((f, i) => (
                  <AccordionItem
                    key={i}
                    q={f.q}
                    a={f.a}
                    isOpen={openIndex === i}
                    onToggle={() => handleToggle(i)}
                  />
                ))}
              </div>

              {/* Quick links to other categories */}
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                {FAQ_CATEGORIES.filter((_, i) => i !== activeCategory).map(
                  (cat, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveCategory(FAQ_CATEGORIES.indexOf(cat));
                        setOpenIndex(null);
                      }}
                      className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-slate-100 hover:border-[#1e3a8a]/30 hover:shadow-lg transition-all text-left group"
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <div className="font-bold text-slate-800 text-sm group-hover:text-[#1e3a8a] transition-colors">
                          {cat.category}
                        </div>
                        <div className="text-xs text-slate-400">
                          {cat.faqs.length} questions
                        </div>
                      </div>
                      <span className="ml-auto text-slate-300 group-hover:text-[#1e3a8a] transition-colors">
                        →
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Still have questions ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <WaterBlob
              className="absolute -right-20 -top-20 opacity-20"
              color="white"
              size={250}
              animate={false}
            />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🤔</div>
              <h2 className="text-3xl font-black text-white mb-3">
                Still have questions?
              </h2>
              <p className="text-blue-200 mb-8 max-w-md mx-auto">
                Our team is available Mon–Sat 8AM–8PM and Sunday 9AM–5PM. We
                respond within 2 hours on WhatsApp.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://wa.me/918179019929?text=Hi!%20I%20have%20a%20question%20about%20rentals."
                  className="flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-green-600 transition-colors"
                >
                  💬 WhatsApp Us
                </a>
                <a
                  href="tel:8179019929"
                  className="flex items-center gap-2 bg-white text-[#1e3a8a] font-bold px-6 py-3.5 rounded-2xl hover:bg-blue-50 transition-colors"
                >
                  📞 Call Now
                </a>
                <a
                  href="mailto:mklenterprises1247@gmail.com"
                  className="flex items-center gap-2 border-2 border-white/40 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  ✉️ Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
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
