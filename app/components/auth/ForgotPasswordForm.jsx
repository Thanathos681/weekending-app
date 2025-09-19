import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../../constants/Colors';

export default function ForgotPasswordForm({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        setError(error.message);
        Alert.alert('Reset Failed', error.message);
      } else {
        setIsSuccess(true);
        Alert.alert('Reset Email Sent!', 'Please check your email for password reset instructions.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      Alert.alert('Error', 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setEmail(value);
    if (error) setError('');
  };

  // Success state view
  if (isSuccess) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.successCard]}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Reset Email Sent!</Text>
            <Text style={styles.subtitle}>
              We've sent password reset instructions to{' '}
              <Text style={styles.emailText}>{email}</Text>. 
              Check your email and follow the link to reset your password.
            </Text>
          </View>

          {/* Instructions Box */}
          <View style={styles.instructionsBox}>
            <View style={styles.instructionsHeader}>
              <Text style={styles.mailIcon}>📧</Text>
              <Text style={styles.instructionsTitle}>Next steps:</Text>
            </View>
            <View style={styles.stepsList}>
              <Text style={styles.step}>1. Check your email inbox</Text>
              <Text style={styles.step}>2. Click the reset link in the email</Text>
              <Text style={styles.step}>3. Create a new password</Text>
              <Text style={styles.step}>4. Return here to sign in</Text>
            </View>
          </View>

          {/* Back Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={onBackToLogin}>
            <Text style={styles.arrowIcon}>←</Text>
            <Text style={styles.primaryButtonText}>Back to Login</Text>
          </TouchableOpacity>

          {/* Footer Note */}
          <Text style={styles.footerText}>
            Didn't receive the email? Check your spam folder or try again.
          </Text>
        </View>
      </View>
    );
  }

  // Form input view
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reset Your Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>✉</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Enter your email address"
              placeholderTextColor={Colors.mutedForeground}
              value={email}
              onChangeText={handleInputChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {error && (
            <Text style={styles.errorText}>⚠ {error}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.primaryForeground} />
          ) : (
            <Text style={styles.primaryButtonText}>Send Reset Email</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login Button */}
        <TouchableOpacity style={styles.secondaryButton} onPress={onBackToLogin}>
          <Text style={styles.arrowIcon}>←</Text>
          <Text style={styles.secondaryButtonText}>Back to Login</Text>
        </TouchableOpacity>
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
    borderColor: Colors.border,
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
  successCard: {
    borderColor: Colors.success + '40',
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
    width: '100%',
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
  formGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: Colors.cardForeground,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.input,
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: Colors.cardForeground,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    fontSize: 16,
    zIndex: 1,
  },
  inputError: {
    borderColor: Colors.destructive,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: Colors.destructive,
    marginTop: 4,
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
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: Colors.primaryForeground,
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: Colors.cardForeground,
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  arrowIcon: {
    fontSize: 16,
    color: Colors.mutedForeground,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: Colors.mutedForeground,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});