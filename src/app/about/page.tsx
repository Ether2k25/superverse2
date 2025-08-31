import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About - ICE SUPER',
  description: 'Learn about ICE SUPER - Your trusted source for iGaming industry insights, casino technology, and affiliate marketing expertise.',
  keywords: 'about ICE SUPER, iGaming experts, casino technology, affiliate marketing',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ice-black">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-ice-black via-ice-black to-ice-black/90 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-ice-white mb-6">
                About <span className="text-ice-yellow">ICE SUPER</span>
              </h1>
              <p className="text-xl text-ice-white/80 max-w-3xl mx-auto mb-8">
                Your trusted source for cutting-edge insights in casino technology, 
                affiliate growth strategies, and the future of iGaming.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-ice-white mb-6">
                  Our <span className="text-ice-yellow">Mission</span>
                </h2>
                <p className="text-ice-white/80 text-lg leading-relaxed mb-6">
                  At ICE SUPER, we're dedicated to empowering the iGaming industry with 
                  actionable insights, cutting-edge technology analysis, and proven strategies 
                  that drive real business growth.
                </p>
                <p className="text-ice-white/80 text-lg leading-relaxed mb-8">
                  We bridge the gap between complex industry developments and practical 
                  implementation, helping casino operators, affiliates, and technology 
                  providers stay ahead of the curve.
                </p>
                <Link href="/blog" className="cta-button inline-block px-6 py-3">
                  Read Our Insights
                </Link>
              </div>
              <div className="bg-gradient-to-br from-ice-yellow/10 to-ice-blue/10 border border-ice-yellow/20 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-ice-yellow mb-4">What We Cover</h3>
                <ul className="space-y-3 text-ice-white/80">
                  <li className="flex items-start">
                    <span className="text-ice-yellow mr-3">•</span>
                    Casino Technology & Innovation
                  </li>
                  <li className="flex items-start">
                    <span className="text-ice-blue mr-3">•</span>
                    Affiliate Marketing Strategies
                  </li>
                  <li className="flex items-start">
                    <span className="text-ice-yellow mr-3">•</span>
                    Regulatory Compliance & Updates
                  </li>
                  <li className="flex items-start">
                    <span className="text-ice-blue mr-3">•</span>
                    Market Analysis & Trends
                  </li>
                  <li className="flex items-start">
                    <span className="text-ice-yellow mr-3">•</span>
                    Business Growth Tactics
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gradient-to-r from-ice-yellow/5 to-ice-blue/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-ice-white mb-4">
                Our <span className="text-ice-yellow">Values</span>
              </h2>
              <p className="text-ice-white/80 max-w-2xl mx-auto">
                The principles that guide everything we do at ICE SUPER
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-ice-yellow/10 border border-ice-yellow/20 rounded-lg p-6">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-ice-yellow mb-3">Precision</h3>
                  <p className="text-ice-white/70">
                    We deliver accurate, well-researched insights that you can trust and act upon.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-ice-blue/10 border border-ice-blue/20 rounded-lg p-6">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-ice-blue mb-3">Innovation</h3>
                  <p className="text-ice-white/70">
                    We stay at the forefront of industry developments to bring you tomorrow's insights today.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-ice-yellow/10 border border-ice-yellow/20 rounded-lg p-6">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-bold text-ice-yellow mb-3">Partnership</h3>
                  <p className="text-ice-white/70">
                    We're not just content creators - we're your strategic partners in growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-ice-white mb-4">
                Expert <span className="text-ice-yellow">Team</span>
              </h2>
              <p className="text-ice-white/80 max-w-2xl mx-auto">
                Our team combines decades of experience in iGaming, technology, and digital marketing
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-ice-black/60 border border-ice-yellow/20 rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-ice-yellow/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👨‍💼</span>
                </div>
                <h3 className="text-xl font-bold text-ice-white mb-2">Alex Chen</h3>
                <p className="text-ice-yellow mb-3">Technology Analyst</p>
                <p className="text-ice-white/70 text-sm">
                  15+ years in casino technology and platform development
                </p>
              </div>
              <div className="bg-ice-black/60 border border-ice-blue/20 rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-ice-blue/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👩‍💼</span>
                </div>
                <h3 className="text-xl font-bold text-ice-white mb-2">Sarah Johnson</h3>
                <p className="text-ice-blue mb-3">Affiliate Strategy Expert</p>
                <p className="text-ice-white/70 text-sm">
                  12+ years in affiliate marketing and partnership development
                </p>
              </div>
              <div className="bg-ice-black/60 border border-ice-yellow/20 rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-ice-yellow/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <h3 className="text-xl font-bold text-ice-white mb-2">Mike Rodriguez</h3>
                <p className="text-ice-yellow mb-3">Industry Analyst</p>
                <p className="text-ice-white/70 text-sm">
                  10+ years in market research and regulatory compliance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-ice-yellow/10 to-ice-blue/10 border-t border-ice-yellow/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-ice-white mb-4">
              Ready to Stay Ahead?
            </h2>
            <p className="text-ice-white/80 mb-8">
              Join thousands of industry professionals who trust ICE SUPER for their iGaming intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="cta-button px-6 py-3">
                Read Our Blog
              </Link>
              <Link href="/contact" className="bg-transparent border border-ice-yellow text-ice-yellow px-6 py-3 rounded-lg hover:bg-ice-yellow hover:text-ice-black transition-all duration-300">
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
