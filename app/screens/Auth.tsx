// app/screens/Auth.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { Colors } from '../../constants/Colors';

// We'll create these components in Phase 2
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import RegistrationSuccess from '../components/auth/RegistrationSuccess';

export default function Auth({ navigation }) {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register' | 'forgot-password' | 'registration-success'
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle authentication success
  useEffect(() => {
    if (user && !isLoading) {
      const hasCompletedOnboarding = user.user_metadata?.onboarding_completed;
      
      if (hasCompletedOnboarding) {
        navigation.replace('MainTabs'); // Go to main app
      } else {
        navigation.replace('Onboarding'); // Go to onboarding
      }
    }
  }, [user, isLoading, navigation]);

  const handleRegistrationSuccess = (email) => {
    setRegisteredEmail(email);
    setCurrentView('registration-success');
  };

  const handleBackToWelcome = () => {
    navigation.goBack();
  };

  // Render back button
  const renderBackButton = () => (
    <TouchableOpacity style={styles.backButton} onPress={handleBackToWelcome}>
      <Text style={styles.backButtonText}>← Back to Welcome</Text>
    </TouchableOpacity>
  );

  // Registration success view
  if (currentView === 'registration-success') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[Colors.background, Colors.secondary]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {renderBackButton()}
            <View style={styles.centerContent}>
              <RegistrationSuccess 
                email={registeredEmail} 
                onBackToLogin={() => setCurrentView('login')} 
              />
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Forgot password view
  if (currentView === 'forgot-password') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[Colors.background, Colors.secondary]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {renderBackButton()}
            <View style={styles.centerContent}>
              <ForgotPasswordForm onBackToLogin={() => setCurrentView('login')} />
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Main auth view (login/register)
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.secondary]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              {renderBackButton()}
              
              <View style={styles.centerContent}>
                <View style={styles.card}>
                  {/* Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.headerText}>
                      <Text style={styles.title}>
                        {currentView === 'login' ? 'Welcome Back' : 'Join The Weekending'}
                      </Text>
                      <Text style={styles.subtitle}>
                        {currentView === 'login' 
                          ? 'Sign in to continue your fitness journey' 
                          : 'Create your account to start tracking your workouts'
                        }
                      </Text>
                    </View>
                  </View>

                  {/* Forms */}
                  <View style={styles.cardContent}>
                    {currentView === 'login' ? (
                      <LoginForm 
                        onSwitchToRegister={() => setCurrentView('register')}
                        onForgotPassword={() => setCurrentView('forgot-password')}
                      />
                    ) : (
                      <RegisterForm 
                        onSuccess={handleRegistrationSuccess}
                        onSwitchToLogin={() => setCurrentView('login')}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'Montserrat-Medium',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  cardHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  logoContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  headerText: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: Colors.cardForeground,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardContent: {
    padding: 24,
  },
});