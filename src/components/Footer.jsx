"use client";

import Link from "next/link";


// ─── FOOTER ──────────────────────────────────────────────────────────────────
export default function Footer() {
  const footerSections = [
    {
      title: "Quick Links",
      links: [
        ["Home",        "/home"],
        ["Services",    "/services"],
        ["Rental Plans","/plans"],
        ["How It Works","/how-it-works"],
        ["Brands",      "/brands"],
        ["About Us",    "/about"],
        ["FAQ",         "/faq"],
        ["Contact",     "/contact"],
      ],
    },
    {
      title: "Services",
      links: [
        ["Water Purifier Rental", "/plans"],
        ["RO Installation",       "/services"],
        ["AMC Maintenance",       "/plans"],
        ["Filter Replacement",    "/services"],
        ["RO Repair Service",     "/services"],
      ],
    },
    {
      title: "Contact Info",
      links: [
        ["+91 81790 19929",              "tel:8179019929"],
        ["mklenterprises@gmail.com",     "mailto:mklenterprises@gmail.com"],
        ["NAD Junction",                 "/contact"],
        ["Visakhapatnam, AP 530027",     "/contact"],
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#071120] border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white font-black text-sm tracking-wide">
                    MKL
                  </span>
                </div>

                <div>
                  <h3 className="text-white text-xl font-black tracking-tight">
                    MKL Enterprises
                  </h3>
                  <p className="text-blue-400 text-sm font-medium">
                    Premium Water Purifier Solutions
                  </p>
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed text-sm max-w-md mb-8">
                Trusted water purifier rental, sales, and maintenance services
                in Visakhapatnam. Delivering clean, safe, and healthy drinking
                water solutions for homes and businesses.
              </p>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="tel:8179019929"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-600/20 hover:scale-105"
                >
                  Call Now
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-blue-500/40 bg-white/5 hover:bg-blue-500/10 text-slate-300 hover:text-white text-sm font-semibold transition-all duration-300"
                >
                  Get Free Quote
                </Link>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6 relative">
                  {section.title}
                  <span className="absolute left-0 -bottom-2 w-10 h-[2px] bg-blue-500 rounded-full" />
                </h4>

                <ul className="space-y-4">
                  {section.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-slate-400 hover:text-blue-400 text-sm transition-all duration-300 hover:translate-x-1 inline-flex"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm text-center md:text-left">
                © 2026 MKL Enterprises. All rights reserved.
              </p>

              <div className="flex items-center gap-6 text-sm">
                <Link
                  href="/privacy-policy"
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Privacy Policy
                </Link>

                <Link
                  href="/terms"
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Terms &amp; Conditions
                </Link>

                <Link
                  href="/admin"
                  className="text-slate-500 hover:text-blue-400 transition-colors"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}