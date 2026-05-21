import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://mklenterprises.in"),

  title: "MKL Enterprises — Premium Water Purifier Rentals | Visakhapatnam",

  description:
    "Rent premium water purifiers in Visakhapatnam with zero upfront cost. Flexible 3-month, 6-month, and annual rental plans with free installation, maintenance, filter replacement, and expert support.",

  keywords: [
    "water purifier rental visakhapatnam",
    "RO purifier rent vizag",
    "water purifier subscription vizag",
    "aquaguard rental vizag",
    "kent purifier rent visakhapatnam",
    "purifier rental service",
    "MKL Enterprises",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "MKL Enterprises — Premium Water Purifier Rental",
    description:
      "Rent premium water purifiers in Vizag with free installation, maintenance, and filter replacement.",
    url: "https://mklenterprises.in",
    siteName: "MKL Enterprises",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MKL Enterprises Water Purifier Rental",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "MKL Enterprises — Premium Water Purifier Rental",
    description:
      "Premium water purifier rentals in Visakhapatnam with flexible plans and full maintenance support.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a8a" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "MKL Enterprises",
              image: "https://mklenterprises.in/og-image.jpg",
              url: "https://mklenterprises.in",
              telephone: "+918179019929",
              email: "mklenterprises1247@gmail.com",

              description:
                "Premium water purifier rental, sales, and service provider in Visakhapatnam.",

              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "D No. 58-1-319, NAD Kotha Road, Opp. Bank of India",
                addressLocality: "Visakhapatnam",
                addressRegion: "Andhra Pradesh",
                postalCode: "530027",
                addressCountry: "IN",
              },

              areaServed: {
                "@type": "City",
                name: "Visakhapatnam",
              },

              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "08:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Sunday",
                  opens: "09:00",
                  closes: "17:00",
                },
              ],

              priceRange: "₹₹",
            }),
          }}
        />
      </head>

      <body suppressHydrationWarning>
        <ReactQueryProvider>
          <Navbar />
          {children}
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}