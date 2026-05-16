"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── BRAND DATA — All major Indian water purifier brands ─────────────────────
export const ALL_BRANDS = [
  { name: "Aquaguard", category: "Premium", tagline: "India's most trusted RO brand", since: "1984", models: "50+" },
  { name: "Kent RO", category: "Premium", tagline: "World's #1 RO water purifier", since: "1999", models: "40+" },
  { name: "Pureit", category: "Premium", tagline: "HUL's advanced purification tech", since: "2005", models: "30+" },
  { name: "Livpure", category: "Premium", tagline: "Smart purification for modern homes", since: "2012", models: "35+" },
  { name: "Bluestar", category: "Premium", tagline: "Commercial & residential RO experts", since: "1943", models: "25+" },
  { name: "Bpure", category: "Mid-range", tagline: "Budget-friendly pure water solutions", since: "2015", models: "20+" },
  { name: "A.O. Smith", category: "Premium", tagline: "American engineering, Indian excellence", since: "2010", models: "20+" },
  { name: "Havells", category: "Mid-range", tagline: "Trusted household electrical brand", since: "2010", models: "18+" },
  { name: "Whirlpool", category: "Mid-range", tagline: "Global home appliances leader", since: "1993", models: "15+" },
  { name: "LG", category: "Premium", tagline: "Life's Good with clean water", since: "2000", models: "12+" },
  { name: "Samsung", category: "Premium", tagline: "Smart water for smart homes", since: "2005", models: "10+" },
  { name: "Mi (Xiaomi)", category: "Budget", tagline: "Smart purification at honest pricing", since: "2019", models: "8+" },
  { name: "Tata Swach", category: "Budget", tagline: "Innovative filtration for all budgets", since: "2009", models: "15+" },
  { name: "V-Guard", category: "Mid-range", tagline: "Voltage of purity for your home", since: "2014", models: "12+" },
  { name: "Faber", category: "Mid-range", tagline: "Italian design, Indian reliability", since: "2008", models: "14+" },
  { name: "Eureka Forbes", category: "Premium", tagline: "Dr. Aquaguard — pioneer in purification", since: "1982", models: "45+" },
  { name: "Hindware", category: "Mid-range", tagline: "Complete home solutions", since: "2012", models: "10+" },
  { name: "iSpring", category: "Premium", tagline: "Under-sink filtration specialists", since: "2005", models: "8+" },
];

export const PLANS = [
  {
    id: "quarterly",
    name: "Quarterly",
    duration: "3 Months",
    price: "₹499",
    perMonth: "₹166/mo",
    color: "#3b82f6",
    gradient: "from-blue-500 to-blue-600",
    popular: false,
    features: [
      "1 Service Visit",
      "Water Quality Check",
      "Filter Inspection",
      "Phone Support",
      "Service Report",
    ],
    notIncluded: ["Filter Replacement", "Emergency Visits"],
  },
  {
    id: "halfyearly",
    name: "Half-Yearly",
    duration: "6 Months",
    price: "₹899",
    perMonth: "₹150/mo",
    color: "#1e3a8a",
    gradient: "from-[#1e3a8a] to-blue-700",
    popular: false,
    features: [
      "2 Service Visits",
      "1 Filter Replacement",
      "Water Quality Check",
      "Priority Phone Support",
      "Service Report",
      "Free Inspection",
    ],
    notIncluded: ["Emergency Visits", "Membrane Replacement"],
  },
  {
    id: "annual",
    name: "Annual",
    duration: "12 Months",
    price: "₹1,599",
    perMonth: "₹133/mo",
    color: "#0f172a",
    gradient: "from-slate-800 to-[#1e3a8a]",
    popular: true,
    features: [
      "4 Service Visits",
      "All Filter Replacements",
      "Water Quality Test",
      "24/7 Priority Support",
      "Digital Service Reports",
      "Free Emergency Visit",
      "Parts at Cost Price",
    ],
    notIncluded: ["Membrane Replacement"],
  },
  {
    id: "premium",
    name: "Premium Annual",
    duration: "12 Months",
    price: "₹2,999",
    perMonth: "₹250/mo",
    color: "#1e3a8a",
    gradient: "from-amber-500 to-orange-600",
    popular: false,
    badge: "All Inclusive",
    features: [
      "Unlimited Service Visits",
      "All Filters + Membrane",
      "All Spare Parts Included",
      "Same-Day Emergency Service",
      "Dedicated Technician",
      "Annual Performance Report",
      "Free Water TDS Testing Kit",
      "Priority Scheduling",
    ],
    notIncluded: [],
  },
];

export const TESTIMONIALS_DATA = [
  { name: "Ravi Kumar", area: "MVP Colony", rating: 5, years: "3 years", plan: "Annual AMC", text: "Excellent service! Technician arrived within 2 hours and fixed everything perfectly. My whole family trusts MKL for our water purifier needs. Very professional team." },
  { name: "Priya Sharma", area: "Maddilapalem", rating: 5, years: "2 years", plan: "Premium Annual", text: "Best AMC plan in Vizag. Three years with MKL and never had a bad experience. They replaced my membrane last month without any extra charge. Truly all-inclusive!" },
  { name: "Suresh Babu", area: "Gajuwaka", rating: 5, years: "1 year", plan: "Half-Yearly", text: "Genuine spare parts and honest pricing. The technician explained everything clearly. MKL is the most transparent service provider I've seen in Visakhapatnam." },
  { name: "Anitha Reddy", area: "Siripuram", rating: 5, years: "4 years", plan: "Annual AMC", text: "I switched from another provider to MKL and the difference is night and day. Fast response, clean work, and they always call before arriving. Highly recommended!" },
  { name: "Venkat Rao", area: "Steel Plant", rating: 5, years: "2 years", plan: "Quarterly", text: "Very affordable and reliable. My Aquaguard has been running perfectly for 2 years since I joined MKL's service plan. Never a single complaint." },
  { name: "Lakshmi Devi", area: "Duvvada", rating: 5, years: "1.5 years", plan: "Annual AMC", text: "As a mother of two, clean water is not optional. MKL ensures my family always has pure water. Their 24/7 support gave me complete peace of mind." },
];

export const FAQS = [
  {
    category: "Service Plans",
    questions: [
      { q: "What is an AMC (Annual Maintenance Contract)?", a: "An AMC is a service agreement where MKL Enterprises takes complete responsibility for maintaining your water purifier. It includes scheduled service visits, filter checks, and priority support for a flat annual fee — no hidden charges." },
      { q: "Can I upgrade my plan mid-year?", a: "Yes! You can upgrade your plan at any time. We'll calculate a pro-rated amount for the remaining period and apply it to your new plan. Call us or visit the portal to upgrade." },
      { q: "What happens when my plan expires?", a: "You'll receive a WhatsApp reminder 30 days before expiry. You can renew online through our customer portal or call us. We offer a 5% loyalty discount on renewal." },
      { q: "Are spare parts included in the plan?", a: "Filters are included in Half-Yearly and Annual plans. The Premium Annual plan includes ALL parts — filters, membrane, and all other spare parts at no extra cost." },
    ],
  },
  {
    category: "Service & Technicians",
    questions: [
      { q: "How quickly will a technician arrive?", a: "For booked services: we arrive at your chosen time slot (morning/afternoon/evening). For emergencies: within 2–4 hours. Premium Annual plan customers get same-day service guaranteed." },
      { q: "Are your technicians certified?", a: "All our technicians are factory-trained and brand-certified. They carry official ID cards and work in branded uniforms. We do thorough background verification before hiring." },
      { q: "Do you service all brands?", a: "Yes! We service all major brands including Aquaguard, Kent RO, Pureit, Livpure, Bluestar, A.O. Smith, Havells, LG, Samsung, Mi, Whirlpool, Tata Swach, and 14+ more brands." },
      { q: "What if the issue isn't resolved in one visit?", a: "If we can't resolve the issue in one visit, we schedule a follow-up at no extra charge. For Premium Annual customers, we provide a temporary purifier while yours is being serviced." },
    ],
  },
  {
    category: "Pricing & Payments",
    questions: [
      { q: "What are your payment options?", a: "We accept UPI (PhonePe, Google Pay, Paytm), cash, bank transfer, and all major debit/credit cards. For AMC plans, you can also opt for quarterly payment EMI." },
      { q: "Are there any hidden charges?", a: "Absolutely none. The price you see is the price you pay. For out-of-plan repairs, we always provide a written estimate before starting any work." },
      { q: "Do you charge for the initial inspection?", a: "Initial inspection and diagnosis is FREE. You only pay if you proceed with the service. No consultation charges ever." },
    ],
  },
  {
    category: "Complaints & Support",
    questions: [
      { q: "How do I raise a complaint?", a: "Three ways: (1) Use our Raise Complaint page online, (2) WhatsApp us at +91 81790 19929, or (3) Call directly. You'll get a complaint ID within minutes for tracking." },
      { q: "How long does complaint resolution take?", a: "We resolve 90% of complaints within 24 hours. Complex hardware issues may take 48 hours. You'll receive WhatsApp updates at every stage." },
      { q: "Can I track my complaint status?", a: "Yes! Log in to the Customer Portal with your mobile number and OTP to see real-time complaint status, service history, and upcoming visits." },
    ],
  },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

export function Navbar({ activePage = "" }) {
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
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Brands", href: "/brands" },
    { label: "Pricing", href: "/pricing" },
    { label: "Why Us", href: "/why-choose-us" },
    { label: "FAQ", href: "/faq" },
  ];

  const isActive = (href) => activePage === href;

  return (
    <nav ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-blue-900/8 border-b border-blue-100" : "bg-transparent"
      }`}>
      {/* Top bar */}
      <div className="bg-[#1e3a8a] text-white text-xs py-2 px-6 flex justify-between items-center">
        <span className="opacity-80 hidden sm:block">🎉 Free Installation · Same-Day Service Available · 163+ Happy Customers</span>
        <span className="opacity-80 sm:hidden">📞 Free Installation Available</span>
        <div className="flex items-center gap-4 opacity-90">
          <a href="tel:8179019929" className="hover:opacity-100 font-medium">📞 81790 19929</a>
          <a href="https://wa.me/918179019929" className="hover:opacity-100">💬 WhatsApp</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute inset-0 bg-[#1e3a8a] rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300 opacity-40" />
            <div className="absolute inset-0 bg-[#1e3a8a] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xs tracking-tight">MKL</span>
            </div>
          </div>
          <div>
            <div className={`font-black text-base leading-none tracking-tight transition-colors ${scrolled ? "text-[#1e3a8a]" : "text-white"}`}>
              MKL Enterprises
            </div>
            <div className={`text-[10px] font-semibold tracking-widest uppercase transition-colors ${scrolled ? "text-blue-400" : "text-blue-200"}`}>
              Water Purifier Experts
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative ${
                isActive(link.href)
                  ? "text-[#1e3a8a] bg-blue-50"
                  : scrolled
                    ? "text-slate-600 hover:text-[#1e3a8a] hover:bg-blue-50"
                    : "text-white/85 hover:text-white hover:bg-white/10"
              }`}>
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1e3a8a]" />
              )}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a href="/portal"
            className={`text-sm font-semibold px-4 py-2 rounded-xl border-2 transition-all ${
              scrolled ? "border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white" : "border-white/60 text-white hover:bg-white hover:text-[#1e3a8a]"
            }`}>
            My Account
          </a>
          <a href="/enquiry"
            className="bg-[#1e3a8a] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/30">
            Book Service
          </a>
        </div>

        {/* Hamburger */}
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {[0,1,2].map(i => (
            <span key={i} className={`block w-6 h-0.5 transition-all duration-300 ${
              i === 0 && menuOpen ? "rotate-45 translate-y-2" :
              i === 1 && menuOpen ? "opacity-0 scale-x-0" :
              i === 2 && menuOpen ? "-rotate-45 -translate-y-2" : ""
            } ${scrolled ? "bg-slate-800" : "bg-white"}`} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden bg-white border-t border-blue-100 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[500px]" : "max-h-0"}`}>
        <div className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
              className={`font-semibold py-2.5 px-3 rounded-xl transition-colors ${
                isActive(l.href) ? "bg-blue-50 text-[#1e3a8a]" : "text-slate-700 hover:text-[#1e3a8a] hover:bg-blue-50"
              }`}>
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-3">
            <a href="/portal" className="flex-1 text-center py-2.5 border-2 border-[#1e3a8a] text-[#1e3a8a] rounded-xl font-bold text-sm">My Account</a>
            <a href="/enquiry" className="flex-1 text-center py-2.5 bg-[#1e3a8a] text-white rounded-xl font-bold text-sm">Book Service</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "#0a1628" }}>
      <div className="max-w-7xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#1e3a8a] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xs">MKL</span>
            </div>
            <span className="text-white font-black">MKL Enterprises</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-5">
            Visakhapatnam's trusted water purifier experts. Pure water, better life.
          </p>
          <div className="space-y-2 text-sm">
            <a href="tel:8179019929" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium">
              📞 +91 81790 19929
            </a>
            <a href="https://wa.me/918179019929" className="flex items-center gap-2 text-green-400 hover:text-green-300 font-medium">
              💬 WhatsApp Us
            </a>
            <p className="text-slate-500 text-xs leading-relaxed mt-2">
              D, 58-1-319, NAD Kotha Rd,<br />NAD Junction, Vizag AP 530027
            </p>
          </div>
        </div>

        {[
          {
            title: "Company",
            links: [["Home", "/"], ["About Us", "/about"], ["Why Choose Us", "/why-choose-us"], ["Testimonials", "/testimonials"], ["How It Works", "/how-it-works"]],
          },
          {
            title: "Services",
            links: [["All Services", "/services"], ["Brands We Service", "/brands"], ["Pricing & Plans", "/pricing"], ["Book a Service", "/enquiry"], ["FAQ", "/faq"]],
          },
          {
            title: "Customer",
            links: [["My Portal", "/portal"], ["Raise Complaint", "/complaint"], ["Track Complaint", "/portal"], ["Renew Plan", "/pricing"], ["Contact Us", "/contact"]],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-slate-400 text-sm hover:text-blue-400 transition-colors font-medium">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <span>© 2026 MKL Enterprises. All rights reserved. · Visakhapatnam, AP</span>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="/admin" className="hover:text-slate-400 transition-colors">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, titleHighlight, subtitle, bg = "dark", children }) {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo([".ph-eye", ".ph-title", ".ph-sub", ".ph-extra"],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.3 }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref}
      className="relative pt-36 pb-20 overflow-hidden"
      style={bg === "dark"
        ? { background: "linear-gradient(135deg, #0a1628 0%, #1e3a8a 60%, #1e4db7 100%)" }
        : { background: "linear-gradient(135deg, #f0f7ff 0%, #dbeafe 100%)" }
      }>
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }} />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #93c5fd, transparent)" }} />
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className={`w-full ${bg === "dark" ? "fill-[#f1f5f9]" : "fill-white"}`}>
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="ph-eye inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border"
          style={bg === "dark" ? { background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "#bfdbfe" } : { background: "#dbeafe", borderColor: "#bfdbfe", color: "#1e3a8a" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
          {eyebrow}
        </div>
        <h1 className={`ph-title text-5xl md:text-6xl font-black leading-tight mb-5 ${bg === "dark" ? "text-white" : "text-slate-900"}`}>
          {title}{" "}
          {titleHighlight && (
            <span className={bg === "dark"
              ? "text-transparent bg-clip-text"
              : "text-[#1e3a8a]"}
              style={bg === "dark" ? { backgroundImage: "linear-gradient(135deg,#60a5fa,#93c5fd)" } : {}}>
              {titleHighlight}
            </span>
          )}
        </h1>
        {subtitle && (
          <p className={`ph-sub text-lg leading-relaxed max-w-2xl mx-auto ${bg === "dark" ? "text-blue-200" : "text-slate-500"}`}>
            {subtitle}
          </p>
        )}
        {children && <div className="ph-extra mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 1500); }, []);
  return (
    <a href="https://wa.me/918179019929?text=Hi!%20I%20need%20water%20purifier%20service."
      target="_blank" rel="noreferrer"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:bg-green-400 hover:scale-110 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
}

export function SectionLabel({ text, light = false }) {
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4 ${
      light ? "bg-white/10 text-blue-200 border border-white/20" : "bg-blue-100 text-[#1e3a8a]"
    }`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {text}
    </span>
  );
}

export function useScrollReveal(selector, vars = {}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(selector,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
          ...vars,
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}