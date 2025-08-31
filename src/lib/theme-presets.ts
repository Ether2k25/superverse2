// Predefined theme presets for different products/brands

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  colors: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  customCSS?: string;
}

export const themePresets: ThemePreset[] = [
  // Casino & Gaming Themes
  {
    id: 'ice-super',
    name: 'ICE SUPER',
    description: 'Original casino tech theme with golden accents',
    category: 'Casino',
    colors: {
      primaryColor: '#FFC300',
      secondaryColor: '#FFD700',
      backgroundColor: '#0A0A0A',
      textColor: '#FFFFFF',
      accentColor: '#FFC300'
    }
  },
  {
    id: 'neon-casino',
    name: 'Neon Casino',
    description: 'Electric neon theme for modern casinos',
    category: 'Casino',
    colors: {
      primaryColor: '#00FFFF',
      secondaryColor: '#FF00FF',
      backgroundColor: '#0D0D0D',
      textColor: '#FFFFFF',
      accentColor: '#00FFFF'
    }
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    description: 'Luxurious gold theme for premium casinos',
    category: 'Casino',
    colors: {
      primaryColor: '#D4AF37',
      secondaryColor: '#FFD700',
      backgroundColor: '#1A1A1A',
      textColor: '#F5F5F5',
      accentColor: '#B8860B'
    }
  },
  {
    id: 'emerald-casino',
    name: 'Emerald Casino',
    description: 'Rich green theme inspired by poker tables',
    category: 'Casino',
    colors: {
      primaryColor: '#50C878',
      secondaryColor: '#90EE90',
      backgroundColor: '#0F1F0F',
      textColor: '#FFFFFF',
      accentColor: '#32CD32'
    }
  },

  // Tech & SaaS Themes
  {
    id: 'tech-blue',
    name: 'Tech Blue',
    description: 'Professional blue theme for tech companies',
    category: 'Technology',
    colors: {
      primaryColor: '#0066CC',
      secondaryColor: '#3399FF',
      backgroundColor: '#0A0E1A',
      textColor: '#FFFFFF',
      accentColor: '#0080FF'
    }
  },
  {
    id: 'cyber-purple',
    name: 'Cyber Purple',
    description: 'Futuristic purple theme for tech startups',
    category: 'Technology',
    colors: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#A78BFA',
      backgroundColor: '#0F0A1A',
      textColor: '#FFFFFF',
      accentColor: '#7C3AED'
    }
  },
  {
    id: 'matrix-green',
    name: 'Matrix Green',
    description: 'Digital green theme for developers',
    category: 'Technology',
    colors: {
      primaryColor: '#00FF41',
      secondaryColor: '#39FF14',
      backgroundColor: '#0D1117',
      textColor: '#C9D1D9',
      accentColor: '#00FF41'
    }
  },

  // E-commerce Themes
  {
    id: 'shopify-green',
    name: 'Commerce Green',
    description: 'Fresh green theme for e-commerce',
    category: 'E-commerce',
    colors: {
      primaryColor: '#00A86B',
      secondaryColor: '#32CD32',
      backgroundColor: '#FFFFFF',
      textColor: '#333333',
      accentColor: '#228B22'
    }
  },
  {
    id: 'luxury-black',
    name: 'Luxury Black',
    description: 'Elegant black theme for premium brands',
    category: 'E-commerce',
    colors: {
      primaryColor: '#C9A96E',
      secondaryColor: '#D4AF37',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      accentColor: '#B8860B'
    }
  },
  {
    id: 'coral-pink',
    name: 'Coral Pink',
    description: 'Warm coral theme for lifestyle brands',
    category: 'E-commerce',
    colors: {
      primaryColor: '#FF6B6B',
      secondaryColor: '#FF8E8E',
      backgroundColor: '#FFFFFF',
      textColor: '#2C2C2C',
      accentColor: '#FF5252'
    }
  },

  // Finance & Business Themes
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional blue for corporate sites',
    category: 'Business',
    colors: {
      primaryColor: '#1E3A8A',
      secondaryColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      accentColor: '#2563EB'
    }
  },
  {
    id: 'finance-dark',
    name: 'Finance Dark',
    description: 'Dark theme for financial platforms',
    category: 'Business',
    colors: {
      primaryColor: '#10B981',
      secondaryColor: '#34D399',
      backgroundColor: '#111827',
      textColor: '#F9FAFB',
      accentColor: '#059669'
    }
  },

  // Creative & Agency Themes
  {
    id: 'creative-orange',
    name: 'Creative Orange',
    description: 'Vibrant orange for creative agencies',
    category: 'Creative',
    colors: {
      primaryColor: '#FF6B35',
      secondaryColor: '#FF8C42',
      backgroundColor: '#1A1A1A',
      textColor: '#FFFFFF',
      accentColor: '#FF5722'
    }
  },
  {
    id: 'artistic-purple',
    name: 'Artistic Purple',
    description: 'Creative purple theme for artists',
    category: 'Creative',
    colors: {
      primaryColor: '#9333EA',
      secondaryColor: '#A855F7',
      backgroundColor: '#0F0F0F',
      textColor: '#FFFFFF',
      accentColor: '#7C2D12'
    }
  },

  // Health & Wellness Themes
  {
    id: 'medical-blue',
    name: 'Medical Blue',
    description: 'Clean blue theme for healthcare',
    category: 'Healthcare',
    colors: {
      primaryColor: '#0EA5E9',
      secondaryColor: '#38BDF8',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      accentColor: '#0284C7'
    }
  },
  {
    id: 'wellness-green',
    name: 'Wellness Green',
    description: 'Natural green for wellness brands',
    category: 'Healthcare',
    colors: {
      primaryColor: '#16A34A',
      secondaryColor: '#22C55E',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      accentColor: '#15803D'
    }
  }
];

export const getThemePresetsByCategory = (category: string): ThemePreset[] => {
  return themePresets.filter(preset => preset.category === category);
};

export const getThemePresetById = (id: string): ThemePreset | undefined => {
  return themePresets.find(preset => preset.id === id);
};

export const getThemeCategories = (): string[] => {
  return Array.from(new Set(themePresets.map(preset => preset.category)));
};
