// RootLayout.js
import localFont from "next/font/local";
import "./globals.css";
import ContextProviders from "../context/ContextProviders";
import { ComplexNavbar } from "../components/layouts/NavBar";
import { FooterWithSocialLinks } from "../components/layouts/Footer";
import { BreadcrumbsWithIcon } from "@/components/layouts/BreadcrumbsWithIcon";
import { ToastContainer } from "react-toastify";
import "react-loading-skeleton/dist/skeleton.css";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "react-toastify/dist/ReactToastify.css";
import FastDonationModal from "@/components/modal/FastDonation";
import SmoothScroll from "@/components/layouts/SmoothScroll";

const ElMessiri = localFont({
  src: "./fonts/ElMessiri.ttf",
  variable: "--font-ElMessiri",
  weight: "100 900",
});

const ReemKufi = localFont({
  src: "./fonts/ReemKufi-Medium.ttf",
  variable: "--font-ReemKufi",
  weight: "100 900",
});
// app/layout.js (or head.js depending on your Next.js version)
export const metadata = {
  title: "منصة عطاء - تمكين القطاع الخيري والتنموي",
  description:
    "منصة عطاء هي بوابتك لتعزيز المشاركة المجتمعية الفعالة من خلال دعم الجمعيات الخيرية، التبرع، وإطلاق المبادرات التنموية بشفافية وموثوقية.",
  keywords: [
    "عطاء",
    "منصة عطاء",
    "التبرع",
    "العمل الخيري",
    "الجمعيات الخيرية",
    "التبرعات",
    "التنمية المستدامة",
    "المشاركة المجتمعية",
  ],
  authors: [{ name: "منصة عطاء" }],
  creator: "منصة عطاء",
  openGraph: {
    type: "website",
    locale: "ar",
    url: "https://ataa-platform.com",
    title: "منصة عطاء - تمكين القطاع الخيري والتنموي",
    description:
      "تعرف على منصة عطاء ودورها في تمكين العمل الخيري والتنمية المستدامة من خلال دعم الجمعيات، حملات التبرع، وبرامج الشفافية.",
    siteName: "منصة عطاء",
    images: [
      {
        url: "https://ataa-platform.com/images/ataa-logo.png",
        width: 1200,
        height: 630,
        alt: "منصة عطاء - شعار الموقع",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ataa-platform",
    title: "منصة عطاء - تمكين القطاع الخيري والتنموي",
    description:
      "منصة عطاء توفر حلولاً مبتكرة لدعم الجمعيات الخيرية والعمل التنموي مع التركيز على الشفافية والموثوقية.",
    images: [
      {
        url: "https://ataa-platform.com/images/ataa-banner.png",
        alt: "منصة عطاء - لافتة الموقع",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://ataa-platform.com",
    languages: {
      ar: "https://ataa-platform.com",
      en: "https://ataa-platform.com/en",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html data-theme={"light"} lang="en">
      <body
        className={`
          flex
          flex-col
          overflow-x-hidden
          text-foreground
          bg-background
          ${ReemKufi.variable} antialiased
          ${ElMessiri.variable} antialiased
        `}
      >
        <ContextProviders>
          <ComplexNavbar />
          <div className="min-h-[50vh]">{children}</div>
          <ToastContainer position="bottom-left" />
          <FooterWithSocialLinks />
        </ContextProviders>
      </body>
    </html>
  );
}
