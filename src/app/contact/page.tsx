'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setThankYouMessage(data.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          subject: '',
          message: '',
        });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ice-black">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-ice-black via-ice-black to-ice-black/90 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-ice-white mb-6">
                Get In <span className="text-ice-yellow">Touch</span>
              </h1>
              <p className="text-xl text-ice-white/80 max-w-3xl mx-auto mb-8">
                Ready to take your iGaming business to the next level? 
                Let's discuss how ICE SUPER can help you achieve your goals.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-ice-black/60 border border-ice-yellow/20 rounded-lg p-8">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="thank-you"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center py-8"
                    >
                      <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
                      <h2 className="text-2xl font-bold text-ice-white mb-4">
                        Thank You!
                      </h2>
                      <p className="text-ice-white/80 mb-6">
                        {thankYouMessage}
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-ice-yellow text-ice-black px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-ice-gold hover:scale-105"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="text-2xl font-bold text-ice-white mb-6">
                        Send Us a Message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-ice-white mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              required
                              value={formData.firstName}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-ice-black border border-ice-yellow/20 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:border-ice-yellow"
                              placeholder="John"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-ice-white mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              required
                              value={formData.lastName}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-ice-black border border-ice-yellow/20 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:border-ice-yellow"
                              placeholder="Doe"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-ice-white mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-ice-black border border-ice-yellow/20 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:border-ice-yellow"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-ice-white mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-ice-black border border-ice-yellow/20 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:border-ice-yellow"
                            placeholder="Your Company"
                          />
                        </div>

                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-ice-white mb-2">
                            Subject *
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-ice-black border border-ice-yellow/20 rounded-lg text-ice-white focus:outline-none focus:border-ice-yellow"
                          >
                            <option value="">Select a topic</option>
                            <option value="consultation">Business Consultation</option>
                            <option value="partnership">Partnership Opportunity</option>
                            <option value="content">Content Collaboration</option>
                            <option value="speaking">Speaking Engagement</option>
                            <option value="press">Press Inquiry</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-ice-white mb-2">
                            Message *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={6}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-ice-black border border-ice-yellow/20 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:border-ice-yellow resize-none"
                            placeholder="Tell us about your project or inquiry..."
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full inline-flex items-center justify-center gap-2 bg-ice-yellow text-ice-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-ice-gold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={16} />
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-ice-white mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-ice-yellow/10 border border-ice-yellow/20 rounded-lg p-3">
                        <span className="text-ice-yellow text-xl">📧</span>
                      </div>
                      <div>
                        <h3 className="text-ice-white font-semibold mb-1">Email</h3>
                        <p className="text-ice-white/70">hello@icesuper.com</p>
                        <p className="text-ice-white/50 text-sm">We typically respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-ice-blue/10 border border-ice-blue/20 rounded-lg p-3">
                        <span className="text-ice-blue text-xl">💼</span>
                      </div>
                      <div>
                        <h3 className="text-ice-white font-semibold mb-1">Business Hours</h3>
                        <p className="text-ice-white/70">Monday - Friday: 9:00 AM - 6:00 PM GMT</p>
                        <p className="text-ice-white/50 text-sm">Emergency support available 24/7</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-ice-yellow/10 border border-ice-yellow/20 rounded-lg p-3">
                        <span className="text-ice-yellow text-xl">🌍</span>
                      </div>
                      <div>
                        <h3 className="text-ice-white font-semibold mb-1">Global Reach</h3>
                        <p className="text-ice-white/70">Serving clients worldwide</p>
                        <p className="text-ice-white/50 text-sm">Remote consultations available</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="bg-gradient-to-br from-ice-yellow/10 to-ice-blue/10 border border-ice-yellow/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-ice-yellow mb-4">How We Can Help</h3>
                  <ul className="space-y-3 text-ice-white/80">
                    <li className="flex items-start">
                      <span className="text-ice-yellow mr-3">•</span>
                      Strategic business consultation
                    </li>
                    <li className="flex items-start">
                      <span className="text-ice-blue mr-3">•</span>
                      Technology implementation guidance
                    </li>
                    <li className="flex items-start">
                      <span className="text-ice-yellow mr-3">•</span>
                      Affiliate program optimization
                    </li>
                    <li className="flex items-start">
                      <span className="text-ice-blue mr-3">•</span>
                      Market analysis and research
                    </li>
                    <li className="flex items-start">
                      <span className="text-ice-yellow mr-3">•</span>
                      Regulatory compliance support
                    </li>
                    <li className="flex items-start">
                      <span className="text-ice-blue mr-3">•</span>
                      Custom content creation
                    </li>
                  </ul>
                </div>

                {/* Response Time */}
                <div className="bg-ice-black/60 border border-ice-blue/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-ice-blue mb-4">Response Times</h3>
                  <div className="space-y-3 text-ice-white/80">
                    <div className="flex justify-between">
                      <span>General Inquiries:</span>
                      <span className="text-ice-blue">24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Partnership Requests:</span>
                      <span className="text-ice-blue">48 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Press Inquiries:</span>
                      <span className="text-ice-blue">12 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Urgent Matters:</span>
                      <span className="text-ice-blue">Same day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gradient-to-r from-ice-yellow/5 to-ice-blue/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-ice-white mb-4">
                Frequently Asked <span className="text-ice-yellow">Questions</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-ice-black/60 border border-ice-yellow/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-ice-yellow mb-3">
                  Do you offer custom research services?
                </h3>
                <p className="text-ice-white/70">
                  Yes, we provide tailored market research and analysis services 
                  for specific business needs and industry segments.
                </p>
              </div>
              <div className="bg-ice-black/60 border border-ice-blue/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-ice-blue mb-3">
                  Can you help with regulatory compliance?
                </h3>
                <p className="text-ice-white/70">
                  We offer guidance on regulatory requirements and compliance 
                  strategies across different jurisdictions.
                </p>
              </div>
              <div className="bg-ice-black/60 border border-ice-yellow/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-ice-yellow mb-3">
                  Do you provide speaking services?
                </h3>
                <p className="text-ice-white/70">
                  Our experts are available for conferences, webinars, and 
                  industry events. Contact us for availability.
                </p>
              </div>
              <div className="bg-ice-black/60 border border-ice-blue/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-ice-blue mb-3">
                  What's your consultation process?
                </h3>
                <p className="text-ice-white/70">
                  We start with a discovery call to understand your needs, 
                  then provide a customized proposal and timeline.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
