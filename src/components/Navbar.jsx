"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const btnRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const introPlayed = useRef(false);

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Services", href: "/services" },
    { label: "Plans", href: "/plans" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Brands", href: "/brands" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

  /* -------------------------------------------------------------------------- */
  /*                             INITIAL ANIMATION                              */
  /* -------------------------------------------------------------------------- */

  useLayoutEffect(() => {
    if (introPlayed.current) return;

    introPlayed.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.1,
      });

      tl.fromTo(
        navRef.current,
        {
          opacity: 0,
          y: -30,
          filter: "blur(12px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power4.out",
        }
      )

        .fromTo(
          logoRef.current,
          {
            opacity: 0,
            scale: 0.92,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "expo.out",
          },
          "-=0.7"
        )

        .fromTo(
          linksRef.current.filter(Boolean),
          {
            opacity: 0,
            y: 12,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.6"
        )

        .fromTo(
          btnRef.current,
          {
            opacity: 0,
            scale: 0.9,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.4)",
          },
          "-=0.5"
        );
    });

    return () => ctx.revert();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                 SCROLL FX                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 40;

      setScrolled(isScrolled);

      gsap.to(navRef.current, {
        background: isScrolled
          ? "rgba(255,255,255,0.78)"
          : "rgba(255,255,255,0)",

        backdropFilter: isScrolled
          ? "blur(24px)"
          : "blur(0px)",

        borderBottomColor: isScrolled
          ? "rgba(219,234,254,0.8)"
          : "rgba(255,255,255,0)",

        boxShadow: isScrolled
          ? "0 10px 30px rgba(15,23,42,0.08)"
          : "0 0 0 rgba(0,0,0,0)",

        duration: 0.4,
        ease: "power2.out",
      });
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                              MAGNETIC BUTTON                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const btn = btnRef.current;

    if (!btn) return;

    const xTo = gsap.quickTo(btn, "x", {
      duration: 0.45,
      ease: "power3",
    });

    const yTo = gsap.quickTo(btn, "y", {
      duration: 0.45,
      ease: "power3",
    });

    const move = (e) => {
      const rect = btn.getBoundingClientRect();

      const x =
        e.clientX - rect.left - rect.width / 2;

      const y =
        e.clientY - rect.top - rect.height / 2;

      xTo(x * 0.25);
      yTo(y * 0.25);
    };

    const leave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener("mousemove", move);
    btn.addEventListener("mouseleave", leave);

    return () => {
      btn.removeEventListener("mousemove", move);
      btn.removeEventListener("mouseleave", leave);
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               LINK HOVERS                                  */
  /* -------------------------------------------------------------------------- */

  const handleHoverEnter = (el) => {
    const underline =
      el.querySelector(".nav-underline");

    gsap.to(el, {
      y: -2,
      duration: 0.3,
      ease: "power3.out",
    });

    gsap.to(underline, {
      scaleX: 1,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  const handleHoverLeave = (
    el,
    isActive
  ) => {
    const underline =
      el.querySelector(".nav-underline");

    gsap.to(el, {
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    });

    gsap.to(underline, {
      scaleX: isActive ? 1 : 0,
      duration: 0.28,
      ease: "power2.out",
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                               MOBILE MENU                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const menu = mobileMenuRef.current;

    if (!menu) return;

    if (menuOpen) {
      gsap.set(menu, {
        display: "block",
        height: 0,
        opacity: 0,
      });

      gsap.to(menu, {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power4.out",
      });

      gsap.fromTo(
        menu.querySelectorAll(".mobile-link"),
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.45,
          ease: "power3.out",
        }
      );
    } else {
      gsap.to(menu, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(menu, {
            display: "none",
          });
        },
      });
    }
  }, [menuOpen]);

  return (
    <>
      <style>{`
        .navbar-wrapper {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 100;
        }

        .navbar {
          border-bottom: 1px solid transparent;
        }

        .nav-underline {
          position: absolute;
          left: 12%;
          bottom: 0;
          width: 76%;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            #2563eb,
            #60a5fa
          );
          transform-origin: left;
        }

        .mobile-panel {
          display: none;
          overflow: hidden;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(24px);
          border-top: 1px solid rgba(219,234,254,0.8);
        }
      `}</style>

      <div className="navbar-wrapper">

        {/* NAV */}

        <nav
          ref={navRef}
          className="navbar py-4"
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

            {/* LOGO */}

            <Link
              href="/home"
              ref={logoRef}
              className="flex items-center gap-3"
            >
              <div className="relative w-11 h-11">
                <div
                  className="absolute inset-0 rounded-2xl bg-[#1e3a8a]"
                  style={{
                    transform: "rotate(6deg)",
                  }}
                />

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-[#1e3a8a] flex items-center justify-center">
                  <span className="text-white font-black text-sm">
                    MKL
                  </span>
                </div>
              </div>

              <div>
                <div
                  className={`font-black text-[17px] tracking-tight ${
                    scrolled
                      ? "text-slate-900"
                      : "text-white"
                  }`}
                >
                  MKL Enterprises
                </div>

                <div
                  className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
                    scrolled
                      ? "text-blue-500"
                      : "text-blue-200"
                  }`}
                >
                  Premium Rentals
                </div>
              </div>
            </Link>

            {/* DESKTOP LINKS */}

            <div className="hidden lg:flex items-center gap-1">

              {navLinks.map((link, i) => {
                const isActive =
                  pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    ref={(el) =>
                      (linksRef.current[i] = el)
                    }
                    onMouseEnter={(e) =>
                      handleHoverEnter(
                        e.currentTarget
                      )
                    }
                    onMouseLeave={(e) =>
                      handleHoverLeave(
                        e.currentTarget,
                        isActive
                      )
                    }
                    className={`relative px-4 py-2 rounded-xl text-[13px] font-semibold ${
                      isActive
                        ? scrolled
                          ? "text-[#1e3a8a]"
                          : "text-white"
                        : scrolled
                        ? "text-slate-600"
                        : "text-white/80"
                    }`}
                  >
                    {link.label}

                    <span
                      className="nav-underline"
                      style={{
                        transform: isActive
                          ? "scaleX(1)"
                          : "scaleX(0)",
                      }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3">

              {/* CTA */}

              <Link
                href="/contact"
                ref={btnRef}
                className="hidden md:flex items-center justify-center bg-[#1e3a8a] text-white px-5 py-3 rounded-2xl text-sm font-bold"
              >
                Book Service
              </Link>

              {/* MOBILE BTN */}

              <button
                onClick={() =>
                  setMenuOpen((v) => !v)
                }
                className={`lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 ${
                  scrolled
                    ? "text-slate-900"
                    : "text-white"
                }`}
              >
                <span
                  className="w-5 h-[2px] rounded-full bg-current"
                  style={{
                    transform: menuOpen
                      ? "translateY(7px) rotate(45deg)"
                      : undefined,
                  }}
                />

                <span
                  className="w-5 h-[2px] rounded-full bg-current"
                  style={{
                    opacity: menuOpen ? 0 : 1,
                  }}
                />

                <span
                  className="w-5 h-[2px] rounded-full bg-current"
                  style={{
                    transform: menuOpen
                      ? "translateY(-7px) rotate(-45deg)"
                      : undefined,
                  }}
                />
              </button>
            </div>
          </div>
        </nav>

        {/* MOBILE MENU */}

        <div
          ref={mobileMenuRef}
          className="mobile-panel lg:hidden"
        >
          <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col gap-1">

            {navLinks.map((link) => {
              const isActive =
                pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={`mobile-link flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? "bg-blue-50 text-[#1e3a8a]"
                      : "text-slate-700"
                  }`}
                >
                  <span>{link.label}</span>

                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#1e3a8a]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}