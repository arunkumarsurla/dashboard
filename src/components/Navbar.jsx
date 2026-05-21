"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";   // ← add this

export default function Navbar() {
  const pathname                    = usePathname();           // ← replaces useState + window.location
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);

  const navRef        = useRef(null);
  const logoRef       = useRef(null);
  const linksRef      = useRef([]);
  const btnRef        = useRef(null);
  const mobileMenuRef = useRef(null);
  const topBarRef     = useRef(null);

  const navLinks = [
    { label: "Home",         href: "/home" },
    { label: "Services",     href: "/services" },
    { label: "Plans",        href: "/plans" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Brands",       href: "/brands" },
    { label: "About",        href: "/about" },
    { label: "FAQ",          href: "/faq" },
    { label: "Contact",      href: "/contact" },
  ];

  // ── Sync underline indicators whenever pathname changes ──────────────
  useEffect(() => {
    linksRef.current.forEach((el) => {
      if (!el) return;
      const isActive = el.getAttribute("href") === pathname;
      el.setAttribute("data-active", isActive ? "true" : "false");
      const ul = el.querySelector(".link-ul");
      if (ul) gsap.to(ul, { scaleX: isActive ? 1 : 0, duration: 0.2, ease: "power2.out" });
    });
  }, [pathname]);

  // ── Entrance animation ────────────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(topBarRef.current,                { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" })
      .fromTo(navRef.current,                   { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.25")
      .fromTo(logoRef.current,                  { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }, "-=0.3")
      .fromTo(linksRef.current.filter(Boolean), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.055, ease: "power2.out" }, "-=0.25")
      .fromTo(btnRef.current,                   { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, "-=0.2");
  }, []);

  // ── Scroll: shrink top bar ───────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 60 && !scrolled) {
        setScrolled(true);
        gsap.to(topBarRef.current, { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, duration: 0.32, ease: "power2.inOut" });
      } else if (y <= 60 && scrolled) {
        setScrolled(false);
        gsap.to(topBarRef.current, { height: "auto", opacity: 1, duration: 0.32, ease: "power2.out" });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  // ── Magnetic CTA ─────────────────────────────────────────────────────
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const onMove  = (e) => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3;
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,0.5)" });
    btn.addEventListener("mousemove",  onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); };
  }, []);

  // ── Link hover handlers ───────────────────────────────────────────────
  const handleLinkEnter = useCallback((i) => {
    const el = linksRef.current[i];
    if (!el) return;
    gsap.to(el.querySelector(".link-ul"), { scaleX: 1, duration: 0.22, ease: "power2.out" });
    gsap.to(el, { y: -2, duration: 0.18, ease: "power2.out" });
  }, []);

  const handleLinkLeave = useCallback((i) => {
    const el = linksRef.current[i];
    if (!el) return;
    const isActive = el.getAttribute("href") === pathname;   // ← check against pathname, not data-active
    gsap.to(el.querySelector(".link-ul"), { scaleX: isActive ? 1 : 0, duration: 0.2, ease: "power2.in" });
    gsap.to(el, { y: 0, duration: 0.18, ease: "power2.in" });
  }, [pathname]);

  // ── Mobile menu ───────────────────────────────────────────────────────
  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;
    if (menuOpen) {
      gsap.set(el, { display: "block", height: 0, opacity: 0 });
      gsap.to(el, { height: "auto", opacity: 1, duration: 0.36, ease: "power3.out" });
      gsap.fromTo(el.querySelectorAll(".mobile-link"), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.28, stagger: 0.045, ease: "power2.out", delay: 0.08 });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: "power2.in", onComplete: () => gsap.set(el, { display: "none" }) });
    }
  }, [menuOpen]);

  // ── Close mobile menu on navigation ──────────────────────────────────
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <style>{`
        .navbar-wrapper {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
        }
        .nav-glass {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          border-bottom: 1px solid rgba(219,234,254,0.9);
          box-shadow: 0 2px 24px rgba(30,58,138,0.07), 0 1px 0 rgba(255,255,255,0.7) inset;
        }
        .nav-transparent { background: transparent; }

        .link-ul {
          position: absolute; bottom: 0; left: 12%; width: 76%; height: 2px;
          background: linear-gradient(90deg, #1e3a8a, #3b82f6);
          border-radius: 9999px; transform: scaleX(0); transform-origin: left;
        }
        .link-ul-active { transform: scaleX(1) !important; }

        .cta-btn { position: relative; overflow: hidden; }
        .cta-btn::after {
          content: '';
          position: absolute; top: 0; left: -120%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transform: skewX(-18deg);
          animation: cta-sweep 3.8s ease-in-out infinite;
        }
        @keyframes cta-sweep { 0%,40%{left:-120%} 70%,100%{left:140%} }

        .h-line {
          display: block; width: 21px; height: 2px;
          background: currentColor; border-radius: 9999px;
          transition: transform 0.32s cubic-bezier(.4,0,.2,1), opacity 0.28s;
        }

        .mobile-panel {
          background: rgba(255,255,255,0.99);
          backdrop-filter: blur(28px);
          border-top: 1px solid rgba(219,234,254,0.8);
          box-shadow: 0 20px 60px rgba(30,58,138,0.13);
          overflow: hidden; display: none;
        }

        .top-bar {
          background: linear-gradient(90deg,#071120 0%,#1e3a8a 55%,#1e4db7 100%);
          overflow: hidden;
        }
      `}</style>

      <div className="navbar-wrapper">

        {/* ── Main navbar ── */}
        <nav
          ref={navRef}
          className={`transition-all duration-500 ${scrolled ? "nav-glass" : "nav-transparent"}`}
          style={{ padding: "16px 0" }}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

            {/* Logo */}
            <Link ref={logoRef} href="/home" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-[#1e3a8a] rounded-xl group-hover:rotate-12 transition-transform duration-300" style={{ transform: "rotate(6deg)" }} />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-[#1e3a8a] rounded-xl flex items-center justify-center shadow-md shadow-blue-900/25">
                  <span className="text-white font-black text-sm tracking-tight">MKL</span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-blue-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div>
                <div className={`font-black text-[17px] leading-tight tracking-tight transition-colors duration-300 ${scrolled ? "text-[#1e3a8a]" : "text-white"}`}>
                  MKL Enterprises
                </div>
                <div className={`text-[10px] font-bold tracking-[0.18em] uppercase transition-colors duration-300 ${scrolled ? "text-blue-400" : "text-blue-200/80"}`}>
                  Premium Rentals
                </div>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;       // ← driven by usePathname
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    ref={(el) => (linksRef.current[i] = el)}
                    data-active={isActive ? "true" : "false"}
                    onMouseEnter={() => handleLinkEnter(i)}
                    onMouseLeave={() => handleLinkLeave(i)}
                    className={`relative px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors duration-200 select-none ${
                      isActive
                        ? scrolled ? "text-[#1e3a8a]" : "text-white"
                        : scrolled
                          ? "text-slate-600 hover:text-[#1e3a8a] hover:bg-blue-50/60"
                          : "text-white/80 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {link.label}
                    <span className={`link-ul ${isActive ? "link-ul-active" : ""}`} />
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                ref={btnRef}
                href="/contact"
                className="cta-btn hidden md:inline-flex items-center gap-2 bg-[#1e3a8a] text-white text-[13px] font-bold px-5 py-2.5 rounded-xl transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-900/35 active:scale-95"
                style={{ willChange: "transform" }}
              >
                <svg className="w-3.5 h-3.5 relative z-10 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span className="relative z-10">Book Service</span>
              </Link>

              <button
                className={`lg:hidden flex flex-col items-center justify-center w-9 h-9 gap-[5px] rounded-lg transition-all duration-200 ${
                  scrolled ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/10"
                }`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                <span className="h-line" style={{ transform: menuOpen ? "translateY(7px) rotate(45deg)" : undefined }} />
                <span className="h-line" style={{ opacity: menuOpen ? 0 : 1 }} />
                <span className="h-line" style={{ transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : undefined }} />
              </button>
            </div>

          </div>
        </nav>

        {/* ── Mobile menu ── */}
        <div ref={mobileMenuRef} className="mobile-panel lg:hidden">
          <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-0.5">
            {navLinks.map((l) => {
              const isActive = pathname === l.href;            // ← driven by usePathname
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`mobile-link flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 text-[#1e3a8a]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#1e3a8a]"
                  }`}
                >
                  <span>{l.label}</span>
                  {isActive
                    ? <span className="w-2 h-2 rounded-full bg-[#1e3a8a]" />
                    : <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  }
                </Link>
              );
            })}

            <div className="grid grid-cols-2 gap-2.5 pt-3 mt-2 border-t border-slate-100">
              <Link href="tel:8179019929" className="flex items-center justify-center gap-2 py-3 border-2 border-[#1e3a8a] text-[#1e3a8a] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Call Now
              </Link>
              <Link href="/contact" className="flex items-center justify-center gap-2 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors">
                Book Service
              </Link>
            </div>

            <p className="text-center text-[11px] text-slate-400 pt-2.5 pb-1">
              Mon–Sat 8AM–8PM &nbsp;·&nbsp; Sun 9AM–5PM &nbsp;·&nbsp;
              <Link href="mailto:mklenterprises1247@gmail.com" className="hover:text-[#1e3a8a] transition-colors">
                mklenterprises1247@gmail.com
              </Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}