'use client';

import { useState, useEffect } from 'react';
import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle, XCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { countMarkdownLinks } from '@/utils/markdown';

interface SEOCheckResult {
  id: string;
  title: string;
  status: 'pass' | 'warning' | 'fail';
  score: number;
  message: string;
}

interface SEOCheckerProps {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  slug: string;
}

const SEOChecker = ({ title, content, excerpt, featuredImage, slug }: SEOCheckerProps) => {
  const [seoResults, setSeoResults] = useState<SEOCheckResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const runSEOChecks = () => {
      const checks: SEOCheckResult[] = [];

      // Title checks
      if (title.length === 0) {
        checks.push({
          id: 'title-exists',
          title: 'Title Exists',
          status: 'fail',
          score: 0,
          message: 'Title is required'
        });
      } else if (title.length < 30) {
        checks.push({
          id: 'title-length',
          title: 'Title Length',
          status: 'warning',
          score: 5,
          message: 'Title is too short (recommended: 30-60 characters)'
        });
      } else if (title.length > 60) {
        checks.push({
          id: 'title-length',
          title: 'Title Length',
          status: 'warning',
          score: 5,
          message: 'Title is too long (recommended: 30-60 characters)'
        });
      } else {
        checks.push({
          id: 'title-length',
          title: 'Title Length',
          status: 'pass',
          score: 10,
          message: 'Title length is optimal'
        });
      }

      // Excerpt checks
      if (excerpt.length === 0) {
        checks.push({
          id: 'excerpt-exists',
          title: 'Meta Description',
          status: 'fail',
          score: 0,
          message: 'Meta description (excerpt) is required'
        });
      } else if (excerpt.length < 120) {
        checks.push({
          id: 'excerpt-length',
          title: 'Meta Description Length',
          status: 'warning',
          score: 5,
          message: 'Meta description is too short (recommended: 120-160 characters)'
        });
      } else if (excerpt.length > 160) {
        checks.push({
          id: 'excerpt-length',
          title: 'Meta Description Length',
          status: 'warning',
          score: 5,
          message: 'Meta description is too long (recommended: 120-160 characters)'
        });
      } else {
        checks.push({
          id: 'excerpt-length',
          title: 'Meta Description Length',
          status: 'pass',
          score: 10,
          message: 'Meta description length is optimal'
        });
      }

      // Content checks
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount === 0) {
        checks.push({
          id: 'content-length',
          title: 'Content Length',
          status: 'fail',
          score: 0,
          message: 'Content is required'
        });
      } else if (wordCount < 300) {
        checks.push({
          id: 'content-length',
          title: 'Content Length',
          status: 'warning',
          score: 5,
          message: `Content is too short (${wordCount} words, recommended: 300+ words)`
        });
      } else {
        checks.push({
          id: 'content-length',
          title: 'Content Length',
          status: 'pass',
          score: 15,
          message: `Content length is good (${wordCount} words)`
        });
      }

      // Featured image check
      if (!featuredImage) {
        checks.push({
          id: 'featured-image',
          title: 'Featured Image',
          status: 'fail',
          score: 0,
          message: 'Featured image is recommended for better SEO'
        });
      } else {
        checks.push({
          id: 'featured-image',
          title: 'Featured Image',
          status: 'pass',
          score: 10,
          message: 'Featured image is set'
        });
      }

      // Slug check
      if (!slug) {
        checks.push({
          id: 'slug-exists',
          title: 'URL Slug',
          status: 'fail',
          score: 0,
          message: 'URL slug is required'
        });
      } else if (slug.length > 50) {
        checks.push({
          id: 'slug-length',
          title: 'URL Slug Length',
          status: 'warning',
          score: 5,
          message: 'URL slug is too long (recommended: under 50 characters)'
        });
      } else {
        checks.push({
          id: 'slug-length',
          title: 'URL Slug Length',
          status: 'pass',
          score: 10,
          message: 'URL slug length is optimal'
        });
      }

      // Headings check
      const headingMatches = content.match(/#{1,6}\s+.+/g);
      if (!headingMatches || headingMatches.length === 0) {
        checks.push({
          id: 'headings',
          title: 'Headings Structure',
          status: 'fail',
          score: 0,
          message: 'No headings found. Use # for H1, ## for H2, etc.'
        });
      } else {
        checks.push({
          id: 'headings',
          title: 'Headings Structure',
          status: 'pass',
          score: 10,
          message: `${headingMatches.length} headings found`
        });
      }

      // Links check (internal and external)
      const linkCounts = countMarkdownLinks(content);
      if (linkCounts.total === 0) {
        checks.push({
          id: 'links',
          title: 'Internal/External Links',
          status: 'fail',
          score: 0,
          message: 'No links found. Add internal/external links for better SEO'
        });
      } else if (linkCounts.total < 3) {
        checks.push({
          id: 'links',
          title: 'Internal/External Links',
          status: 'warning',
          score: 5,
          message: `${linkCounts.total} links found (${linkCounts.internal} internal, ${linkCounts.external} external). Consider adding more links`
        });
      } else {
        checks.push({
          id: 'links',
          title: 'Internal/External Links',
          status: 'pass',
          score: 10,
          message: `${linkCounts.total} links found (${linkCounts.internal} internal, ${linkCounts.external} external)`
        });
      }

      // Readability check (simple sentence length)
      if (wordCount === 0) {
        checks.push({
          id: 'readability',
          title: 'Readability',
          status: 'fail',
          score: 0,
          message: 'No content to analyze for readability'
        });
      } else {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
        if (avgWordsPerSentence > 25) {
          checks.push({
            id: 'readability',
            title: 'Readability',
            status: 'warning',
            score: 5,
            message: 'Consider shorter sentences for better readability'
          });
        } else {
          checks.push({
            id: 'readability',
            title: 'Readability',
            status: 'pass',
            score: 10,
            message: 'Good sentence length for readability'
          });
        }
      }

      setSeoResults(checks);
      
      // Calculate overall score
      const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
      const maxScore = 90; // Maximum possible score
      const percentage = Math.round((totalScore / maxScore) * 100);
      setOverallScore(percentage);
    };

    runSEOChecks();
  }, [title, content, excerpt, featuredImage, slug]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'warning':
        return <AlertCircle className="text-yellow-400" size={16} />;
      case 'fail':
        return <XCircle className="text-red-400" size={16} />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'stroke-green-400';
    if (score >= 60) return 'stroke-yellow-400';
    return 'stroke-red-400';
  };

  // SVG circle calculations for pie chart
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6">
      <h3 className="flex items-center gap-2 text-ice-white font-medium mb-4">
        <BarChart3 size={16} />
        SEO Quality Checker
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Score Pie Chart */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-ice-white/20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${getScoreColorClass(overallScore)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}%
                </div>
                <div className="text-xs text-ice-white/60">SEO Score</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(overallScore)}`}>
              {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Work'}
            </div>
            <div className="text-sm text-ice-white/60">
              {seoResults.filter(r => r.status === 'pass').length} of {seoResults.length} checks passed
            </div>
          </div>
        </div>

        {/* SEO Checks List */}
        <div className="space-y-3">
          <h4 className="text-ice-white font-medium text-sm">SEO Checklist</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {seoResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-3 bg-ice-black/40 rounded-lg border border-ice-yellow/10"
              >
                <div className="mt-0.5">
                  {getStatusIcon(result.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-ice-white text-sm font-medium">
                    {result.title}
                  </div>
                  <div className="text-ice-white/70 text-xs mt-1">
                    {result.message}
                  </div>
                </div>
                <div className="text-xs text-ice-white/50">
                  {result.score}/10
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOChecker;
