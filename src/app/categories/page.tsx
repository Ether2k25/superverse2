import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categories - ICE SUPER',
  description: 'Browse blog posts by category - Technology, Strategy, Industry Insights, and more.',
  keywords: 'iGaming categories, casino technology, affiliate marketing, industry insights',
};

export default function CategoriesPage() {
  const categories = [
    {
      name: 'Technology',
      description: 'Latest innovations in iGaming technology and digital solutions',
      count: 12,
      color: 'ice-yellow',
      href: '/blog?category=technology'
    },
    {
      name: 'Affiliate Marketing',
      description: 'Strategies and insights for successful affiliate partnerships',
      count: 8,
      color: 'ice-blue',
      href: '/blog?category=affiliate-marketing'
    },
    {
      name: 'Industry Insights',
      description: 'Market analysis and trends in the iGaming industry',
      count: 15,
      color: 'ice-yellow',
      href: '/blog?category=industry-insights'
    },
    {
      name: 'Strategy',
      description: 'Business strategies and growth tactics for casino operators',
      count: 10,
      color: 'ice-blue',
      href: '/blog?category=strategy'
    },
    {
      name: 'Regulation',
      description: 'Compliance, legal updates, and regulatory changes',
      count: 6,
      color: 'ice-yellow',
      href: '/blog?category=regulation'
    },
    {
      name: 'Future Trends',
      description: 'Predictions and emerging trends shaping the industry',
      count: 9,
      color: 'ice-blue',
      href: '/blog?category=future-trends'
    }
  ];

  return (
    <div className="min-h-screen bg-ice-black">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-ice-black via-ice-black to-ice-black/90 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-ice-white mb-6">
                Blog <span className="text-ice-yellow">Categories</span>
              </h1>
              <p className="text-xl text-ice-white/80 max-w-3xl mx-auto mb-8">
                Explore our content organized by topics that matter most to the iGaming industry.
                Find exactly what you're looking for.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group block"
                >
                  <div className={`bg-ice-black/60 border border-${category.color}/20 rounded-lg p-6 transition-all duration-300 hover:border-${category.color}/40 hover:bg-ice-black/80 hover:transform hover:scale-105`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xl font-bold text-${category.color} group-hover:text-${category.color}`}>
                        {category.name}
                      </h3>
                      <span className={`bg-${category.color}/10 text-${category.color} px-3 py-1 rounded-full text-sm font-medium`}>
                        {category.count} posts
                      </span>
                    </div>
                    <p className="text-ice-white/70 group-hover:text-ice-white/90 transition-colors duration-300">
                      {category.description}
                    </p>
                    <div className={`mt-4 text-${category.color} text-sm font-medium group-hover:underline`}>
                      Browse posts →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-ice-yellow/10 to-ice-blue/10 border-t border-ice-yellow/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-ice-white mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-ice-white/80 mb-8">
              Browse all our blog posts or get in touch with our team for specific insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="cta-button px-6 py-3">
                View All Posts
              </Link>
              <Link href="/contact" className="bg-transparent border border-ice-yellow text-ice-yellow px-6 py-3 rounded-lg hover:bg-ice-yellow hover:text-ice-black transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
