import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity  } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from './app/lib/supabase';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Import your screens
import Welcome from './app/screens/Welcome';
import Auth from './app/screens/Auth';

// Placeholder screens for now
const DashboardScreen = () => (
  <View style={styles.placeholder}>
    <Text style={[styles.placeholderText, { fontFamily: 'Montserrat-Bold' }]}>Dashboard Screen</Text>
    <Text style={{ fontFamily: 'Montserrat-Regular' }}>Your calendar view will go here</Text>
  </View>
);

const ProfileScreen = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.placeholder}>
      <Text style={[styles.placeholderText, { fontFamily: 'Montserrat-Bold' }]}>Profile Screen</Text>
      <Text style={{ fontFamily: 'Montserrat-Regular' }}>Your profile will go here</Text>
      
      <TouchableOpacity 
        style={{ backgroundColor: '#FF5555', padding: 10, marginTop: 20, borderRadius: 8 }}
        onPress={handleLogout}
      >
        <Text style={{ color: 'white', fontFamily: 'Montserrat-Medium' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const WeekendersScreen = () => (
  <View style={styles.placeholder}>
    <Text style={[styles.placeholderText, { fontFamily: 'Montserrat-Bold' }]}>Weekenders Screen</Text>
    <Text style={{ fontFamily: 'Montserrat-Regular' }}>Social feed will go here</Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main tabs for logged-in users
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: { fontFamily: 'Montserrat-Medium' },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Weekenders" 
        component={WeekendersScreen}
        options={{ tabBarLabel: 'Social' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts first
  useEffect(() => {
    async function loadFonts() {
      try {
        console.log('Starting to load fonts...');
        await Font.loadAsync({
          'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
          'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
          'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
          'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        });
        console.log('Fonts loaded successfully!');
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Continue even if fonts fail
      }
    }
    loadFonts();
  }, []);

  // Load session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Hide splash screen when everything is ready
  useEffect(() => {
    if (fontsLoaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  // Show loading while fonts or session are loading
  if (!fontsLoaded || loading) {
    return null; // Keep splash screen visible
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          // Not logged in - show public screens starting with Welcome
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Auth" component={Auth} />
          </>
        ) : (
          // Logged in - show main app
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});