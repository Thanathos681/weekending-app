import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: "The Weekending",
  slug: "weekending",
  scheme: "weekending", // deep links like weekending://
  ios: { bundleIdentifier: "com.weekending.app", supportsTablet: false },
  android: {
    package: "com.weekending.app",
    adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#000000" }
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    env: process.env.EXPO_PUBLIC_ENV ?? "dev"
  },
  plugins: [
    "expo-notifications",
    ["expo-build-properties", { ios: { useFrameworks: "static" } }]
  ]
});
