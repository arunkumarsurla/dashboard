// ============================================================
// CONTACT PAGE — save as: app/contact/page.jsx
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

function RippleButton({ children, className = "", href, onClick, type }) {
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top, id = Date.now();
    setRipples(r => [...r, { x, y, id }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    onClick && onClick(e);
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} type={type} className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {ripples.map(rp => <span key={rp.id} className="absolute rounded-full pointer-events-none" style={{ left: rp.x - 50, top: rp.y - 50, width: 100, height: 100, background: "rgba(255,255,255,0.3)", animation: "ripple 0.7s ease-out forwards" }} />)}
      {children}
    </Tag>
  );
}



export function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-hero-title", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.5 });
      gsap.fromTo(".contact-hero-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.7 });
      gsap.fromTo(".contact-card", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".contact-grid", start: "top 80%", once: true } });
      gsap.fromTo(".contact-form-inner", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: formRef.current, start: "top 75%", once: true } });
      gsap.to(".contact-blob", { y: -20, x: 10, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, document.body);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <style>{`@keyframes ripple{from{transform:scale(0);opacity:1}to{transform:scale(4);opacity:0}}html{scroll-behavior:smooth}.spinner{border:3px solid #e2e8f0;border-top-color:#1e3a8a;border-radius:50%;width:22px;height:22px;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "linear-gradient(135deg,#0a1628 0%,#1e3a8a 55%,#1e4db7 100%)" }}>
        <div className="contact-blob absolute -top-24 -right-24 opacity-20 pointer-events-none"><WaterBlob color="#60a5fa" opacity={1} size={450} /></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none" className="w-full"><path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" fill="#f1f5f9" /></svg></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
            <span className="text-blue-200 text-sm font-semibold tracking-wider uppercase">Get In Touch</span>
          </div>
          <h1 className="contact-hero-title text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            We Respond<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#60a5fa,#93c5fd)" }}>Within 2 Hours</span>
          </h1>
          <p className="contact-hero-sub text-lg text-blue-200">Call, WhatsApp, or fill out the form. Our team is ready to help you get clean water today.</p>
        </div>
      </section>

      {/* ── Quick Contact Cards ── */}
      <section className="py-16 bg-[#f1f5f9]">
        <div className="contact-grid max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-4">
          {[
            { icon: "📞", title: "Call Us", val: "+91 81790 19929", sub: "Mon–Sat 8AM–8PM", href: "tel:8179019929", bg: "from-[#1e3a8a] to-blue-600" },
            { icon: "💬", title: "WhatsApp", val: "Chat Now →", sub: "Usually replies in 30 min", href: "https://wa.me/918179019929", bg: "from-green-600 to-green-500" },
            { icon: "✉️", title: "Email", val: "mklenterprises1247@gmail.com", sub: "Replies within 4 hours", href: "mailto:mklenterprises1247@gmail.com", bg: "from-slate-700 to-slate-800" },
            { icon: "📍", title: "Visit Us", val: "NAD Junction, Vizag", sub: "AP 530027 · Mon–Sat", href: "#map", bg: "from-blue-700 to-[#1e3a8a]" },
          ].map((c, i) => (
            <a key={i} href={c.href} className={`contact-card group relative bg-gradient-to-br ${c.bg} rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>
              <WaterBlob className="absolute -right-8 -top-8 opacity-20" color="white" size={120} animate={false} />
              <div className="relative z-10">
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">{c.title}</div>
                <div className="font-bold text-sm leading-snug mb-1 break-words">{c.val}</div>
                <div className="text-white/50 text-xs">{c.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Form ── */}
      <section ref={formRef} className="py-16 bg-[#f1f5f9]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="contact-form-inner bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-blue-50">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">Message Sent!</h3>
                <p className="text-slate-500 mb-6">Our team will get back to you within 2 hours.<br />For urgent needs, WhatsApp us directly.</p>
                <a href="https://wa.me/918179019929?text=Hi!%20I%20just%20sent%20an%20enquiry%20on%20your%20website." className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-green-600 transition-colors">💬 Continue on WhatsApp</a>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Send Us a Message</h2>
                  <p className="text-slate-500">Fill in your details and we&apos;ll reach out to discuss your water purifier needs.</p>
                </div>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                    <input type="text" required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:border-[#1e3a8a] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number *</label>
                    <input type="tel" required pattern="[0-9]{10}" placeholder="10-digit number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:border-[#1e3a8a] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:border-[#1e3a8a] focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Service Required</label>
                    <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:border-[#1e3a8a] focus:outline-none transition-colors bg-white">
                      <option value="">Select a service</option>
                      <option>Purifier Rental</option>
                      <option>New Installation</option>
                      <option>Repair Service</option>
                      <option>Filter Replacement</option>
                      <option>AMC Plan</option>
                      <option>Purifier Purchase</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                    <textarea rows={4} placeholder="Tell us about your requirement, area, current purifier (if any)..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:border-[#1e3a8a] focus:outline-none transition-colors resize-none" />
                  </div>
                  <div className="md:col-span-2">
                    <RippleButton type="submit" className="w-full py-4 bg-[#1e3a8a] text-white font-bold rounded-2xl hover:bg-blue-800 transition-colors flex items-center justify-center gap-3 text-base shadow-xl shadow-blue-900/30">
                      {loading ? <><span className="spinner" /> Processing...</> : <><span>📩</span> Send Message</>}
                    </RippleButton>
                    <p className="text-center text-xs text-slate-400 mt-3">By submitting, you agree to be contacted by MKL Enterprises.</p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Hours & Map placeholder ── */}
      <section id="map" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Business Hours</h2>
            <div className="space-y-3">
              {[
                { day: "Monday – Friday", hours: "8:00 AM – 8:00 PM", open: true },
                { day: "Saturday", hours: "8:00 AM – 6:00 PM", open: true },
                { day: "Sunday", hours: "9:00 AM – 5:00 PM", open: true },
                { day: "Public Holidays", hours: "Emergency calls only", open: false },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-700 text-sm">{h.day}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${h.open ? "bg-green-400" : "bg-slate-300"}`} />
                    <span className="text-slate-500 text-sm">{h.hours}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="font-black text-[#1e3a8a] mb-1">📍 Our Location</div>
              <div className="text-slate-600 text-sm">NAD Junction, Visakhapatnam<br />Andhra Pradesh 530027</div>
            </div>
          </div>
          <div className="bg-[#f1f5f9] rounded-3xl h-80 flex items-center justify-center border border-blue-100">
            <div className="text-center">
              <div className="text-5xl mb-3">📍</div>
              <div className="font-bold text-slate-700">NAD Junction, Visakhapatnam</div>
              <div className="text-slate-400 text-sm mt-1">AP 530027</div>
              <a href="https://maps.google.com/?q=NAD+Junction+Visakhapatnam" target="_blank" rel="noreferrer" className="inline-block mt-4 bg-[#1e3a8a] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors">Open in Google Maps →</a>
            </div>
          </div>
        </div>
      </section>

      <a href="https://wa.me/918179019929?text=Hi!%20I%20need%20water%20purifier%20service." target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:bg-green-400 hover:scale-110 transition-all duration-300">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
      </a>
    </>
  );
}

export default ContactPage;