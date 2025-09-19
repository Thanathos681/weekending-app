// constants/Colors.js
// Converted from your web app's HSL values to hex/rgba for React Native

export const Colors = {
  // Main theme colors
  background: '#0A0A0A',           // hsl(0 0% 3.9%) - Very dark background
  foreground: '#FAFAFA',           // hsl(0 0% 98%) - Almost white text
  
  // Card colors
  card: '#0A0A0A',                 // hsl(0 0% 3.9%) - Dark card background
  cardForeground: '#FAFAFA',       // hsl(0 0% 98%) - Light card text
  
  // Primary colors (Red accent)
  primary: '#FF5555',              // hsl(0 84% 60%) - Bright red primary
  primaryForeground: '#FAFAFA',    // hsl(0 0% 98%) - White on primary
  
  // Secondary colors
  secondary: '#262626',            // hsl(0 0% 14.9%) - Dark gray
  secondaryForeground: '#FAFAFA',  // hsl(0 0% 98%) - White on secondary
  
  // Muted colors
  muted: '#262626',                // hsl(0 0% 14.9%) - Dark gray
  mutedForeground: '#A3A3A3',      // hsl(0 0% 63.9%) - Medium gray text
  
  // Accent colors
  accent: '#FF5555',               // hsl(0 84% 60%) - Same as primary
  accentForeground: '#171717',     // hsl(0 0% 9%) - Very dark on accent
  
  // Destructive/Error colors
  destructive: '#FF5555',          // hsl(0 84% 60%) - Red for errors
  destructiveForeground: '#FAFAFA', // hsl(0 0% 98%) - White on destructive
  
  // Border and input colors
  border: '#262626',               // hsl(0 0% 14.9%) - Dark border
  input: '#262626',                // hsl(0 0% 14.9%) - Dark input background
  ring: '#FF5555',                 // hsl(0 84% 60%) - Red focus ring
  
  // Dark red variant
  darkRed: '#7F1D1D',              // hsl(0 60% 25%) - Dark red
  darkRedForeground: '#FAFAFA',    // hsl(0 0% 98%) - White on dark red
  darkRedBorder: '#DC2626',        // hsl(0 70% 45%) - Red border
  
  // Sidebar colors (same as main theme)
  sidebar: '#0A0A0A',
  sidebarForeground: '#FAFAFA',
  sidebarPrimary: '#FF5555',
  sidebarPrimaryForeground: '#FAFAFA',
  sidebarAccent: '#262626',
  sidebarAccentForeground: '#FAFAFA',
  sidebarBorder: '#262626',
  sidebarRing: '#FF5555',
  
  // Additional useful colors for mobile
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Status colors
  success: '#10B981',              // Green for success states
  warning: '#F59E0B',              // Orange for warnings
  info: '#3B82F6',                 // Blue for info
  
  // Shadow colors (for iOS/Android shadows)
  shadowLight: 'rgba(255, 255, 255, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.3)',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  backdropBlur: 'rgba(10, 10, 10, 0.9)',
};