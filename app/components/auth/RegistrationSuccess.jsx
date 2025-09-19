import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../../constants/Colors';

export default function RegistrationSuccess({ email, onBackToLogin }) {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Trigger resend of confirmation email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error && !error.message.includes('already registered')) {
        Alert.alert('Error', 'Failed to resend email. Please try again later.');
      } else {
        Alert.alert('Email Sent!', "We've sent another verification email to your inbox.");
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  const openEmailApp = () => {
    // Try to open the default email app on mobile
    Linking.openURL('mailto:')
      .catch(() => {
        Alert.alert('Email App', 'Please check your email app manually.');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Check Your Email!</Text>
          <Text style={styles.subtitle}>
            We've sent a verification link to{' '}
            <Text style={styles.emailText}>{email}</Text>. 
            Click the link in the email to activate your account.
          </Text>
        </View>

        {/* Instructions Box */}
        <View style={styles.instructionsBox}>
          <View style={styles.instructionsHeader}>
            <Text style={styles.mailIcon}>📧</Text>
            <Text style={styles.instructionsTitle}>What's next?</Text>
          </View>
          <View style={styles.stepsList}>
            <Text style={styles.step}>1. Check your email inbox</Text>
            <Text style={styles.step}>2. Look for our verification email</Text>
            <Text style={styles.step}>3. Click "Verify Email" in the message</Text>
            <Text style={styles.step}>4. Return here to sign in</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* Open Email App Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={openEmailApp}>
            <Text style={styles.buttonIcon}>📧</Text>
            <Text style={styles.primaryButtonText}>Open Email App</Text>
          </TouchableOpacity>

          {/* Secondary Buttons Row */}
          <View style={styles.secondaryButtonsRow}>
            {/* Resend Email */}
            <TouchableOpacity 
              style={[styles.secondaryButton, isResending && styles.buttonDisabled]}
              onPress={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? (
                <ActivityIndicator size="small" color={Colors.border} />
              ) : (
                <Text style={styles.refreshIcon}>🔄</Text>
              )}
              <Text style={styles.secondaryButtonText}>
                {isResending ? 'Sending...' : 'Resend Email'}
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={onBackToLogin}
            >
              <Text style={styles.secondaryButtonText}>Back to Login</Text>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Didn't receive the email? Check your spam folder or try resending.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.success + '40',
    padding: 32,
    alignItems: 'center',
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 64,
    height: 64,
    backgroundColor: Colors.success + '20',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: 32,
    color: Colors.success,
    fontFamily: 'Montserrat-Bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.cardForeground,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
  emailText: {
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.cardForeground,
  },
  instructionsBox: {
    width: '100%',
    backgroundColor: Colors.info + '10',
    borderWidth: 1,
    borderColor: Colors.info + '30',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  mailIcon: {
    fontSize: 20,
  },
  instructionsTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: Colors.cardForeground,
  },
  stepsList: {
    gap: 4,
  },
  step: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: Colors.mutedForeground,
    lineHeight: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonIcon: {
    fontSize: 16,
  },
  primaryButtonText: {
    color: Colors.primaryForeground,
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.background,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  refreshIcon: {
    fontSize: 14,
  },
  arrowIcon: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  secondaryButtonText: {
    color: Colors.cardForeground,
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    width: '100%',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 16,
  },
});