// ============================================================
// HOW IT WORKS PAGE — save as: app/how-it-works/page.jsx
// ============================================================
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function WaterBlob({ className = "", color = "#1e3a8a", opacity = 0.08, size = 600, animate = true }) {
  const blobRef = useRef(null);
  useEffect(() => {
    if (!animate || !blobRef.current) return;
    gsap.to(blobRef.current, { attr: { d: "M60,0 C93,0 120,27 120,60 C120,93 100,115 60,120 C20,125 0,93 0,60 C0,27 27,0 60,0 Z" }, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, [animate]);
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path ref={blobRef} d="M60,0 C95,5 120,30 115,65 C110,100 85,120 50,118 C15,116 0,90 0,60 C0,25 25,-5 60,0 Z" fill={color} fillOpacity={opacity} />
    </svg>
  );
}

function RippleButton({ children, className = "", href }) {
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top, id = Date.now();
    setRipples(r => [...r, { x, y, id }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
  };
  return (
    <a href={href} className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {ripples.map(rp => <span key={rp.id} className="absolute rounded-full pointer-events-none" style={{ left: rp.x - 50, top: rp.y - 50, width: 100, height: 100, background: "rgba(255,255,255,0.3)", animation: "ripple 0.7s ease-out forwards" }} />)}
      {children}
    </a>
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
    gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 });
  }, []);
  const navLinks = [
    { label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Services", href: "/services" },
    { label: "Brands", href: "/brands" }, { label: "Plans", href: "/plans" }, { label: "FAQs", href: "/faqs" }, { label: "Contact", href: "/contact" },
  ];
  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-blue-900/8 border-b border-blue-100" : "bg-transparent"}`}>
      <div className="bg-[#1e3a8a] text-white text-xs py-2 px-6 flex justify-between items-center">
        <span className="opacity-80">🎉 Free Installation across Visakhapatnam & surrounding areas</span>
        <div className="flex items-center gap-4 opacity-90">
          <a href="tel:8179019929" className="hover:opacity-100">📞 +91 81790 19929</a>
          <span>|</span>
          <a href="https://wa.me/918179019929" className="hover:opacity-100">💬 WhatsApp</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-[#1e3a8a] rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-blue-400 rounded-xl flex items-center justify-center"><span className="text-white font-black text-sm">MKL</span></div>
          </div>
          <div>
            <div className={`font-black text-lg leading-none tracking-tight transition-colors ${scrolled ? "text-[#1e3a8a]" : "text-white"}`}>MKL Enterprises</div>
            <div className={`text-xs font-medium tracking-widest uppercase transition-colors ${scrolled ? "text-blue-400" : "text-blue-200"}`}>Rentals, Sales & Service</div>
          </div>
        </a>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => <a key={link.label} href={link.href} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-blue-50 hover:text-[#1e3a8a] ${scrolled ? "text-slate-700" : "text-white/90 hover:text-[#1e3a8a]"}`}>{link.label}</a>)}
        </div>
        <div className="hidden md:flex">
          <RippleButton href="/contact" className="bg-[#1e3a8a] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/30">Book Now</RippleButton>
        </div>
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""} ${scrolled ? "bg-slate-800" : "bg-white"}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""} ${scrolled ? "bg-slate-800" : "bg-white"}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""} ${scrolled ? "bg-slate-800" : "bg-white"}`} />
        </button>
      </div>
      <div className={`md:hidden bg-white border-t border-blue-100 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="px-6 py-4 flex flex-col gap-2">
          {navLinks.map(l => <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-slate-700 font-semibold py-2.5 border-b border-slate-100 hover:text-[#1e3a8a]">{l.label}</a>)}
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
            <div className="w-9 h-9 bg-[#1e3a8a] rounded-xl flex items-center justify-center"><span className="text-white font-black text-xs">MKL</span></div>
            <span className="text-white font-black text-base">MKL Enterprises</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">Visakhapatnam's #1 water purifier rental, sales & service experts.</p>
          <a href="tel:8179019929" className="text-blue-400 font-bold text-sm hover:text-blue-300">+91 81790 19929</a>
        </div>
        {[
          { title: "Pages", links: [["Home", "/"], ["About Us", "/about"], ["Services", "/services"], ["Contact", "/contact"]] },
          { title: "Rentals", links: [["3-Month Plan", "/plans"], ["6-Month Plan", "/plans"], ["12-Month Plan", "/plans"], ["All Brands", "/brands"]] },
          { title: "Support", links: [["FAQs", "/faqs"], ["How It Works", "/how-it-works"], ["Why Choose Us", "/why-choose-us"], ["Raise Complaint", "/complaint"]] },
        ].map((col, i) => (
          <div key={i}>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider">{col.title}</h4>
            <ul className="space-y-2">{col.links.map(([label, href]) => <li key={label}><a href={href} className="text-slate-400 text-sm hover:text-blue-400 transition-colors font-medium">{label}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 text-xs text-slate-600">© 2026 MKL Enterprises. All rights reserved. · NAD Junction, Visakhapatnam AP 530027</div>
      </div>
    </footer>
  );
}

// ── HOW IT WORKS DATA ─────────────────────────────────────────────────────────
const RENTAL_STEPS = [
  { num: "01", icon: "📱", title: "Choose Your Plan", desc: "Visit our Plans page and pick 3, 6, or 12 months. All plans include free delivery, installation, maintenance, and repairs.", detail: "Takes less than 2 minutes. No payment needed upfront." },
  { num: "02", icon: "📋", title: "Fill the Booking Form", desc: "Submit your name, address, phone number, and preferred date. Our team reviews it immediately.", detail: "Or just WhatsApp us at +91 81790 19929 — even simpler." },
  { num: "03", icon: "📞", title: "Confirmation Call", desc: "We call you within 2 hours to confirm your slot, answer questions, and finalize the model you'd like.", detail: "We'll also suggest the best model based on your water TDS — free of charge." },
  { num: "04", icon: "🚗", title: "We Deliver to You", desc: "Our technician arrives at your chosen date and time with the purifier, all tools, and mounting hardware.", detail: "Delivery and installation are 100% free — no hidden logistics charges." },
  { num: "05", icon: "🔩", title: "Installation & Testing", desc: "Purifier is mounted, pipes connected, and water quality tested on-site. We demonstrate how to use it.", detail: "Typical installation takes 30–60 minutes depending on your kitchen setup." },
  { num: "06", icon: "💧", title: "Start Drinking Pure Water", desc: "First payment is made after installation is complete and you're satisfied. Then monthly on the same date.", detail: "We send digital reminders for payments and scheduled maintenance visits." },
];

const SERVICE_STEPS = [
  { num: "01", icon: "📲", title: "Book via Call or WhatsApp", desc: "Contact us with your issue — motor not working, low flow, bad taste, error light, or just routine service. We log it immediately." },
  { num: "02", icon: "⏰", title: "Slot Confirmed in 30 Min", desc: "We confirm a same-day or next-morning slot based on your preference and technician availability in your area." },
  { num: "03", icon: "🧰", title: "Technician Arrives", desc: "Our certified technician arrives with the right tools and common spare parts. They carry OEM parts for all 8 brands." },
  { num: "04", icon: "🔬", title: "Diagnosis & Fix", desc: "Technician diagnoses the issue, explains the problem clearly, and completes the repair with your approval on any part changes." },
  { num: "05", icon: "🧪", title: "Water Quality Test", desc: "Post-repair, water quality and TDS are tested to confirm everything is working correctly before leaving your home." },
  { num: "06", icon: "📄", title: "Report & Bill via WhatsApp", desc: "You receive a digital service report and itemized bill instantly via WhatsApp. For rental customers — zero charge." },
];

export default function HowItWorksPage() {
  const heroRef = useRef(null);
  const rentalRef = useRef(null);
  const serviceRef = useRef(null);
  const [activeTab, setActiveTab] = useState("rental");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hiw-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.5 });
      gsap.fromTo(".hiw-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.7 });
      gsap.to(".hiw-blob", { y: -20, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });

      gsap.fromTo(".rental-step", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: rentalRef.current, start: "top 80%", once: true } });
      gsap.fromTo(".service-step", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: serviceRef.current, start: "top 80%", once: true } });
    }, document.body);
    return () => ctx.revert();
  }, []);

  const steps = activeTab === "rental" ? RENTAL_STEPS : SERVICE_STEPS;
  const stepClass = activeTab === "rental" ? "rental-step" : "service-step";
  const ref = activeTab === "rental" ? rentalRef : serviceRef;

  return (
    <>
      <style>{`@keyframes ripple{from{transform:scale(0);opacity:1}to{transform:scale(4);opacity:0}}html{scroll-behavior:smooth}`}</style>
      <Navbar />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative pt-36 pb-20 overflow-hidden" style={{ background: "linear-gradient(135deg,#0a1628 0%,#1e3a8a 55%,#1e4db7 100%)" }}>
        <div className="hiw-blob absolute -top-24 -right-24 opacity-20 pointer-events-none"><WaterBlob color="#60a5fa" opacity={1} size={450} /></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none" className="w-full"><path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" fill="#f1f5f9" /></svg></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
            <span className="text-blue-200 text-sm font-semibold tracking-wider uppercase">Simple Process</span>
          </div>
          <h1 className="hiw-title text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Clean Water in<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#60a5fa,#93c5fd)" }}>6 Easy Steps</span>
          </h1>
          <p className="hiw-sub text-lg text-blue-200">From booking to installation, we make the entire process effortless. No paperwork, no hassle, no upfront cost.</p>
        </div>
      </section>

      {/* ── Tab Toggle ── */}
      <section className="bg-[#f1f5f9] pt-16 pb-4">
        <div className="max-w-xs mx-auto px-6">
          <div className="flex bg-white rounded-2xl p-1.5 border border-blue-100 shadow-sm">
            <button onClick={() => setActiveTab("rental")} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "rental" ? "bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/30" : "text-slate-500 hover:text-[#1e3a8a]"}`}>Renting a Purifier</button>
            <button onClick={() => setActiveTab("service")} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "service" ? "bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/30" : "text-slate-500 hover:text-[#1e3a8a]"}`}>Booking a Service</button>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section ref={ref} className="py-20 bg-[#f1f5f9]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900">
              {activeTab === "rental" ? "How to Rent a Purifier" : "How to Book a Service"}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              {activeTab === "rental" ? "From booking to your first glass of pure water — here's every step." : "From your call to a fixed purifier — here's what happens."}
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#1e3a8a]/20 via-[#1e3a8a]/60 to-[#1e3a8a]/20 hidden md:block" />

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className={`${stepClass} flex gap-8 items-start`}>
                  <div className="relative flex-shrink-0 hidden md:block">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1e3a8a] to-blue-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-900/25">
                      {step.icon}
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] font-black text-xs flex items-center justify-center">{i + 1}</span>
                  </div>

                  <div className="flex-1 bg-white rounded-3xl p-6 border border-slate-100 hover:border-[#1e3a8a]/30 hover:shadow-xl hover:shadow-blue-900/8 transition-all group">
                    <div className="md:hidden flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a8a] to-blue-500 flex items-center justify-center text-xl">{step.icon}</div>
                      <span className="text-xs font-black text-[#1e3a8a] uppercase tracking-widest">Step {i + 1}</span>
                    </div>
                    <div className="hidden md:block text-xs font-black text-[#1e3a8a] uppercase tracking-widest mb-2">Step {step.num}</div>
                    <h3 className="font-black text-slate-900 text-xl mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{step.desc}</p>
                    {step.detail && (
                      <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-4 py-2.5">
                        <span className="text-blue-400 text-sm flex-shrink-0">💡</span>
                        <span className="text-[#1e3a8a] text-xs font-medium leading-relaxed">{step.detail}</span>
                      </div>
                    )}
                    <div className="mt-4 h-0.5 rounded-full bg-gradient-to-r from-blue-200 to-[#1e3a8a] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ quick answers ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-10">Quick Answers</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "How quickly will my purifier be installed?", a: "Same day in most cases. Next morning at latest." },
              { q: "Is there any security deposit?", a: "No. Zero security deposit required for all plans." },
              { q: "What if the purifier breaks down?", a: "Call us. We dispatch a technician same day at no cost." },
              { q: "Can I change the model after installation?", a: "Yes, anytime. Model upgrades are free of charge." },
              { q: "Do I need to be home during installation?", a: "Yes, an adult must be present. Takes 30–60 minutes." },
              { q: "How do I pay monthly?", a: "UPI, bank transfer, or cash. Digital receipt via WhatsApp." },
            ].map((qa, i) => (
              <div key={i} className="bg-[#f1f5f9] rounded-2xl p-5 border border-blue-100 hover:border-[#1e3a8a]/30 transition-all">
                <div className="font-bold text-slate-900 text-sm mb-2">{qa.q}</div>
                <div className="text-slate-500 text-sm">{qa.a}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/faqs" className="inline-flex items-center gap-2 text-[#1e3a8a] font-bold hover:gap-3 transition-all">See all FAQs →</a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0a1628 0%,#1e3a8a 100%)" }}>
        <WaterBlob className="absolute -bottom-20 -right-20 opacity-10" color="#93c5fd" size={400} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-200 mb-8">The whole process takes less than 5 minutes to kick off. Clean water starts today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <RippleButton href="/plans" className="bg-white text-[#1e3a8a] font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-black/20">View Rental Plans →</RippleButton>
            <a href="https://wa.me/918179019929" className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 hover:border-white transition-all">💬 WhatsApp Now</a>
          </div>
        </div>
      </section>

      <Footer />
      <a href="https://wa.me/918179019929?text=Hi!%20I%20need%20water%20purifier%20service." target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:bg-green-400 hover:scale-110 transition-all duration-300">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
      </a>
    </>
  );
}