import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
  };
  // Navigation
  navbar: {
    logo: string;
    logoImage: string;
    menuItems: Array<{ name: string; href: string }>;
  };
  // Footer
  footer: {
    companyName: string;
    description: string;
    copyright: string;
    socialLinks: Array<{ name: string; url: string; icon: string }>;
    quickLinks: Array<{ name: string; href: string }>;
  };
  // Colors & Branding
  branding: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    customCSS: string;
  };
  // Typography
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
  };
  // CTA Banner
  ctaBanner: {
    enabled: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor: string;
    textColor: string;
  };
  // SEO & Meta
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
    favicon: string;
  };
  // Blog Settings
  blog: {
    postsPerPage: number;
    showExcerpts: boolean;
    enableComments: boolean;
    enableSocialSharing: boolean;
    categories: string[];
  };
  // Admin Settings
  admin: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    allowRegistration: boolean;
    maintenanceMode: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema({
  hero: {
    title: { type: String, default: 'ICE SUPER Blog' },
    subtitle: { type: String, default: 'Casino Tech, Affiliate Growth & the Future of iGaming' },
    description: { type: String, default: 'Stay ahead of the curve with expert insights, cutting-edge technology trends, and proven strategies that drive success in the dynamic world of online gaming.' },
    backgroundImage: { type: String, default: '' },
    ctaText: { type: String, default: 'Explore Latest Insights' },
    ctaLink: { type: String, default: '#featured' }
  },
  navbar: {
    logo: { type: String, default: 'ICE SUPER' },
    logoImage: { type: String, default: '' },
    menuItems: [{
      name: { type: String, required: true },
      href: { type: String, required: true }
    }]
  },
  footer: {
    companyName: { type: String, default: 'ICE SUPER' },
    description: { type: String, default: 'Leading the future of iGaming with innovative technology and strategic insights.' },
    copyright: { type: String, default: '© 2024 ICE SUPER. All rights reserved.' },
    socialLinks: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      icon: { type: String, required: true }
    }],
    quickLinks: [{
      name: { type: String, required: true },
      href: { type: String, required: true }
    }]
  },
  branding: {
    primaryColor: { type: String, default: '#FFC300' },
    secondaryColor: { type: String, default: '#FFD700' },
    backgroundColor: { type: String, default: '#0f0f0f' },
    textColor: { type: String, default: '#ffffff' },
    accentColor: { type: String, default: '#FFC300' },
    customCSS: { type: String, default: '' }
  },
  typography: {
    headingFont: { type: String, default: 'Inter' },
    bodyFont: { type: String, default: 'Inter' },
    fontSize: {
      small: { type: String, default: '14px' },
      medium: { type: String, default: '16px' },
      large: { type: String, default: '18px' },
      xlarge: { type: String, default: '24px' }
    }
  },
  ctaBanner: {
    enabled: { type: Boolean, default: true },
    title: { type: String, default: 'Ready to Transform Your iGaming Strategy?' },
    description: { type: String, default: 'Join thousands of industry professionals who trust ICE SUPER for the latest insights and innovations.' },
    buttonText: { type: String, default: 'Get Started Today' },
    buttonLink: { type: String, default: '/contact' },
    backgroundColor: { type: String, default: '#FFC300' },
    textColor: { type: String, default: '#0f0f0f' }
  },
  seo: {
    metaTitle: { type: String, default: 'ICE SUPER Blog - Casino Tech & iGaming Future' },
    metaDescription: { type: String, default: 'Stay ahead with expert insights on casino technology, affiliate growth strategies, and the future of iGaming industry.' },
    keywords: { type: String, default: 'iGaming, casino technology, affiliate marketing, online gaming, casino trends' },
    ogImage: { type: String, default: '' },
    favicon: { type: String, default: '/favicon.ico' }
  },
  blog: {
    postsPerPage: { type: Number, default: 9 },
    showExcerpts: { type: Boolean, default: true },
    enableComments: { type: Boolean, default: false },
    enableSocialSharing: { type: Boolean, default: true },
    categories: [{ type: String }]
  },
  admin: {
    siteName: { type: String, default: 'ICE SUPER Blog' },
    siteDescription: { type: String, default: 'Casino Tech, Affiliate Growth & the Future of iGaming' },
    siteUrl: { type: String, default: 'http://localhost:3000' },
    adminEmail: { type: String, default: 'admin@icesuper.com' },
    allowRegistration: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
    maxFileSize: { type: Number, default: 10485760 }, // 10MB
    allowedFileTypes: [{ type: String }]
  }
}, {
  timestamps: true
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
