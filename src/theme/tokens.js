export const designTokens = {
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#15803d',
      600: '#16a34a',
      700: '#15803d',
      900: '#14532d',
    },
    // role-specific primaries
    role: {
      student: {
        500: '#008000', // explicit vibrant green for students
        600: '#006b00',
      },
      teacher: {
        500: '#0b5cff', // professional blue for teachers
        600: '#084bd6',
      }
    },
    secondary: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#fbbf24',
      600: '#f59e0b',
    },
    // role-specific palettes (teacher = azul, student = verde)
    role: {
      teacher: {
        50: '#eef2ff',
        100: '#e0e7ff',
        500: '#2563eb',
        600: '#1e40af',
        700: '#1e3a8a',
      },
      student: {
        50: '#f0fdf4',
        100: '#dcfce7',
        500: '#15803d',
        600: '#16a34a',
        700: '#14532d',
      },
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    // Add a font family and a small type scale mapping for consistent usage
    fontFamily: {
      heading: 'System',
      body: 'System',
    },
    // Named type scale for H1..H3 and body/label
    typeScale: {
      h1: 36,
      h2: 30,
      h3: 24,
      body: 16,
      label: 14,
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 5,
    }
  }
};