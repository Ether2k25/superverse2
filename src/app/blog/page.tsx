import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogGrid from '@/components/BlogGrid';

export const metadata: Metadata = {
  title: 'Blog - ICE SUPER',
  description: 'Latest insights on casino technology, affiliate marketing, and the future of iGaming.',
  keywords: 'iGaming, casino technology, affiliate marketing, online gambling, industry insights',
  openGraph: {
    title: 'Blog - ICE SUPER',
    description: 'Latest insights on casino technology, affiliate marketing, and the future of iGaming.',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ice-black">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-ice-black via-ice-black to-ice-black/90 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-ice-white mb-6">
                ICE SUPER <span className="text-ice-yellow">Blog</span>
              </h1>
              <p className="text-xl text-ice-white/80 max-w-3xl mx-auto mb-8">
                Stay ahead of the curve with expert insights on casino technology, 
                affiliate marketing strategies, and the future of iGaming.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-ice-white/60">
                <span className="bg-ice-yellow/10 px-3 py-1 rounded-full border border-ice-yellow/20">
                  Industry Insights
                </span>
                <span className="bg-ice-blue/10 px-3 py-1 rounded-full border border-ice-blue/20">
                  Technology Trends
                </span>
                <span className="bg-ice-yellow/10 px-3 py-1 rounded-full border border-ice-yellow/20">
                  Growth Strategies
                </span>
                <span className="bg-ice-blue/10 px-3 py-1 rounded-full border border-ice-blue/20">
                  Market Analysis
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Grid Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogGrid />
          </div>
        </section>

        {/* Newsletter CTA Section */}
        <section className="py-16 bg-gradient-to-r from-ice-yellow/10 to-ice-blue/10 border-t border-ice-yellow/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-ice-white mb-4">
              Stay Updated with ICE SUPER
            </h2>
            <p className="text-ice-white/80 mb-8">
              Get the latest insights delivered straight to your inbox. 
              Join thousands of industry professionals who trust ICE SUPER for their iGaming intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-ice-black border border-ice-yellow/20 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:border-ice-yellow"
              />
              <button className="cta-button px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-ice-white/50 mt-4">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
