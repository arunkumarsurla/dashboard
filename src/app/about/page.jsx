"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// ── Shared helpers ──────────────────────────────────────────────────────────
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
      xmlns="http://www.w3.org/2000/svg"
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

function RippleButton({ children, className = "", onClick, href, type }) {
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
      type={type}
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



// ── ABOUT PAGE ──────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: "2018",
    title: "Founded",
    desc: "MKL Enterprises was established at NAD Junction, Visakhapatnam with a mission to provide clean water to every household.",
  },
  {
    year: "2019",
    title: "Rental Model Launched",
    desc: "We pioneered the purifier-rental model in Vizag — making clean water affordable without a large upfront investment.",
  },
  {
    year: "2021",
    title: "100 Happy Families",
    desc: "Crossed the 100-customer milestone with a 5-star satisfaction rating across all rentals and services.",
  },
  {
    year: "2023",
    title: "Expanded to 8 Brands",
    desc: "Now authorized service partners for 8 major brands including Kent, Aquaguard, Livpure, Pureit, and more.",
  },
  {
    year: "2026",
    title: "500+ Renters & Counting",
    desc: "Serving 500+ families across 200+ areas in and around Visakhapatnam with same-day service and zero-cost maintenance.",
  },
];

const VALUES = [
  {
    icon: "💧",
    title: "Purity First",
    desc: "Every purifier we rent or service is tested to ensure your family gets genuinely safe drinking water — no compromises.",
  },
  {
    icon: "🤝",
    title: "Honest Pricing",
    desc: "What you see is what you pay. No hidden charges, no surprise bills. Total transparency in every transaction.",
  },
  {
    icon: "⚡",
    title: "Same-Day Response",
    desc: "We respond within 2 hours and dispatch a technician the same day for all rental and service requests.",
  },
  {
    icon: "🔧",
    title: "Expert Technicians",
    desc: "Certified professionals trained across all major brands — handling installation, repair, and maintenance with precision.",
  },
  {
    icon: "♻️",
    title: "Zero Waste Approach",
    desc: "We collect and responsibly dispose of spent filters, ensuring our service is good for your family and the environment.",
  },
  {
    icon: "🌟",
    title: "Long-term Relationships",
    desc: "Our rental model is built on trust. We aim to be your water partner for life, not just a one-time service call.",
  },
];

const TEAM = [
  {
    name: "Kiran Kumar",
    role: "Founder & CEO",
    desc: "10+ years in water purification. Started MKL to make clean water accessible to all Vizag families.",
    emoji: "👨‍💼",
  },
  {
    name: "Lakshmi Devi",
    role: "Customer Relations Head",
    desc: "Ensures every renter gets white-glove support from day one to the last day of their plan.",
    emoji: "👩‍💼",
  },
  {
    name: "Mahesh Rao",
    role: "Lead Technician",
    desc: "Certified across 8 brands. Has personally installed and serviced 400+ purifiers across Vizag.",
    emoji: "👨‍🔧",
  },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const timelineRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.fromTo(
        ".about-hero-badge",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      )
        .fromTo(
          ".about-hero-title",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.3",
        )
        .fromTo(
          ".about-hero-sub",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        )
        .fromTo(
          ".about-hero-stat",
          { y: 20, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.4)",
          },
          "-=0.2",
        );

      gsap.to(".about-blob-1", {
        y: -25,
        x: 10,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".about-blob-2", {
        y: 20,
        x: -15,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      gsap.fromTo(
        ".timeline-item",
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".value-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".team-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: teamRef.current,
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
      <style>{`@keyframes ripple { from{transform:scale(0);opacity:1} to{transform:scale(4);opacity:0} } html{scroll-behavior:smooth}`}</style>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center overflow-hidden pt-28 pb-16"
        style={{
          background:
            "linear-gradient(135deg,#0a1628 0%,#1e3a8a 55%,#1e4db7 100%)",
        }}
      >
        <div className="about-blob-1 absolute -top-24 -right-24 opacity-20 pointer-events-none">
          <WaterBlob color="#60a5fa" opacity={1} size={450} />
        </div>
        <div className="about-blob-2 absolute -bottom-32 -left-32 opacity-15 pointer-events-none">
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div className="about-hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
              <span className="text-blue-200 text-sm font-semibold tracking-wider uppercase">
                Our Story
              </span>
            </div>
            <h1 className="about-hero-title text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Vizag&apos;s Trusted
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg,#60a5fa,#93c5fd,#bfdbfe)",
                }}
              >
                Water Experts
              </span>
            </h1>
            <p className="about-hero-sub text-lg text-blue-200 leading-relaxed max-w-lg">
              Since 2018, MKL Enterprises has been on a mission to make clean,
              safe drinking water accessible to every family in Visakhapatnam —
              affordably, reliably, and with zero compromise.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "500+", label: "Families Served" },
              { value: "8+", label: "Brands Covered" },
              { value: "200+", label: "Areas in Vizag" },
              { value: "8 Yrs", label: "Of Experience" },
            ].map((s, i) => (
              <div
                key={i}
                className="about-hero-stat group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:-translate-y-1 duration-300"
              >
                <div className="text-4xl font-black text-white mb-1">
                  {s.value}
                </div>
                <div className="text-blue-200 text-sm font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24 bg-[#f1f5f9] relative overflow-hidden">
        <WaterBlob
          className="absolute -right-40 top-0 opacity-40"
          color="#dbeafe"
          size={400}
          animate={false}
        />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Our Mission
            </span>
            <h2 className="text-4xl font-black text-slate-900 mb-6">
              Clean Water{" "}
              <span className="text-[#1e3a8a]">Shouldn&apos;t Be a Luxury</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Buying a water purifier outright costs ₹8,000–₹25,000. For many
              families, that&apos;s not an option. We built our rental model to
              change that — giving every household access to a premium purifier
              for as little as ₹399/month.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              We handle everything: free installation, regular maintenance,
              filter replacements, and even relocation when you move. Your only
              job is to drink clean water.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "No upfront cost — start drinking pure water from Day 1",
                "All maintenance & filter changes included in rental",
                "Switch models or cancel anytime with zero penalty",
                "Serving 200+ areas across Visakhapatnam",
              ].map((pt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-700"
                >
                  <span className="w-5 h-5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs flex-shrink-0">
                    ✓
                  </span>
                  {pt}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-[#1e3a8a] rounded-3xl p-10 text-white relative overflow-hidden">
              <WaterBlob
                className="absolute -right-10 -top-10 opacity-20"
                color="white"
                size={220}
                animate={false}
              />
              <div className="relative z-10">
                <div className="text-5xl mb-6">💧</div>
                <blockquote className="text-2xl font-black leading-snug mb-6">
                  &quot;Every family deserves access to clean, safe drinking water —
                  regardless of income.&quot;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                    👨‍💼
                  </div>
                  <div>
                    <div className="font-bold">Kiran Kumar</div>
                    <div className="text-blue-200 text-sm">
                      Founder, MKL Enterprises
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section
        ref={timelineRef}
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              Our Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              How We <span className="text-[#1e3a8a]">Grew</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#1e3a8a]/20 via-[#1e3a8a]/60 to-[#1e3a8a]/20" />
            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className="timeline-item flex gap-8 items-start pl-2"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#1e3a8a] flex items-center justify-center shadow-lg shadow-blue-900/30">
                      <span className="text-white font-black text-xs">
                        {item.year.slice(2)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#f1f5f9] rounded-2xl p-6 flex-1 border border-blue-100 hover:border-[#1e3a8a]/30 hover:shadow-lg transition-all">
                    <div className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest mb-1">
                      {item.year}
                    </div>
                    <h3 className="font-black text-slate-900 text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section ref={valuesRef} className="py-24 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              What We Stand For
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Our Core <span className="text-[#1e3a8a]">Values</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="value-card group bg-white rounded-3xl p-8 border border-slate-100 hover:border-[#1e3a8a]/30 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl mb-5 group-hover:bg-[#1e3a8a] group-hover:scale-110 transition-all duration-300">
                  {v.icon}
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">
                  {v.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {v.desc}
                </p>
                <div className="mt-4 h-0.5 rounded-full bg-gradient-to-r from-blue-200 to-[#1e3a8a] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section ref={teamRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-[#1e3a8a] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              The Team
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              The People <span className="text-[#1e3a8a]">Behind MKL</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((m, i) => (
              <div key={i} className="team-card text-center group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1e3a8a] to-blue-500 flex items-center justify-center text-4xl mx-auto mb-5 shadow-xl shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                  {m.emoji}
                </div>
                <h3 className="font-black text-slate-900 text-xl mb-1">
                  {m.name}
                </h3>
                <div className="text-[#1e3a8a] font-bold text-sm mb-3">
                  {m.role}
                </div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {m.desc}
                </p>
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
            Ready for Pure Water?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Join 500+ Vizag families who rent their purifier from MKL. Start
            from just ₹399/month.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <RippleButton
              href="/plans"
              className="bg-white text-[#1e3a8a] font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/20"
            >
              View Rental Plans
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

      {/* <Footer /> */}
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
