export const metadata = {
  title: "الاشتراكات منصة عطاء",
  description: "اختر الباقة المناسبة لك للاستفادة من مزايا حصرية!",
  keywords: "اشتراكات, باقات, مميزات, خطة أساسية, خطة متقدمة, خطة مميزة",
  openGraph: {
    title: "الاشتراكات - اختر باقتك المفضلة",
    description: "اكتشف الباقات المختلفة واختر ما يناسب احتياجاتك اليومية.",
    url: "https://ataa-platform.com//subscription",
    images: [
      {
        url: "https://ataa-platform.com/images/subscription-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Subscription Plans Banner",
      },
    ],
  },
};

export default function Layout({ children }) {
  return <div>{children}</div>;
}
