import React, { useState, useEffect } from 'react';
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

export default function ResetPasswordForm({ navigation, route }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // In mobile apps, tokens would come from deep link parameters
  // For now, we'll assume this component is only shown when tokens are valid
  useEffect(() => {
    // Check if we have the required tokens from deep link
    const { accessToken, refreshToken } = route?.params || {};
    
    if (!accessToken || !refreshToken) {
      setError('Invalid or expired reset link. Please request a new password reset.');
    }
  }, [route]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        setError(error.message);
        Alert.alert('Password Reset Failed', error.message);
      } else {
        setIsSuccess(true);
        Alert.alert('Password Updated Successfully!', 'You can now use your new password to sign in.');
        
        // Redirect to auth page after a delay
        setTimeout(() => {
          navigation.navigate('Auth');
        }, 3000);
      }
    } catch (error) {
      const errorMessage = 'An error occurred. Please try again later.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'password') {
      setPassword(value);
    } else {
      setConfirmPassword(value);
    }
    if (error) setError('');
  };

  const goToLogin = () => {
    navigation.navigate('Auth');
  };

  // Error state - invalid link
  if (error && !password && !confirmPassword) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.errorCard]}>
          <View style={styles.iconContainer}>
            <View style={styles.errorIcon}>
              <Text style={styles.alertIcon}>⚠</Text>
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Invalid Reset Link</Text>
            <Text style={styles.subtitle}>{error}</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={goToLogin}>
            <Text style={styles.primaryButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.successCard]}>
          <View style={styles.iconContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Password Updated Successfully!</Text>
            <Text style={styles.subtitle}>
              Your password has been updated. You can now use your new password to sign in.
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Redirecting you to the login page in a few seconds...
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={goToLogin}>
            <Text style={styles.primaryButtonText}>Continue to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Form state
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>
            Enter your new password below. Make sure it's strong and secure.
          </Text>
        </View>

        {/* New Password Field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={[styles.input, styles.passwordInput, error && styles.inputError]}
              placeholder="Enter your new password"
              placeholderTextColor={Colors.mutedForeground}
              value={password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '👁' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={[styles.input, styles.passwordInput, error && styles.inputError]}
              placeholder="Confirm your new password"
              placeholderTextColor={Colors.mutedForeground}
              value={confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
          {error && (
            <Text style={styles.errorText}>⚠ {error}</Text>
          )}
        </View>

        {/* Password Requirements */}
        <View style={styles.requirementsBox}>
          <Text style={styles.requirementsTitle}>Password requirements:</Text>
          <Text style={styles.requirement}>• At least 8 characters long</Text>
          <Text style={styles.requirement}>• Contains uppercase and lowercase letters</Text>
          <Text style={styles.requirement}>• Contains at least one number</Text>
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
            <Text style={styles.primaryButtonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 32,
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
  errorCard: {
    borderColor: Colors.destructive + '40',
  },
  iconContainer: {
    alignItems: 'center',
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
  errorIcon: {
    width: 64,
    height: 64,
    backgroundColor: Colors.destructive + '20',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: 32,
    color: Colors.success,
    fontFamily: 'Montserrat-Bold',
  },
  alertIcon: {
    fontSize: 32,
    color: Colors.destructive,
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
  formGroup: {
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
  passwordInput: {
    paddingRight: 50,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    fontSize: 16,
    zIndex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
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
  requirementsBox: {
    backgroundColor: Colors.info + '10',
    borderWidth: 1,
    borderColor: Colors.info + '30',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: Colors.cardForeground,
    marginBottom: 4,
  },
  requirement: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: Colors.mutedForeground,
    lineHeight: 16,
  },
  infoBox: {
    backgroundColor: Colors.info + '10',
    borderWidth: 1,
    borderColor: Colors.info + '30',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.cardForeground,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: Colors.primaryForeground,
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
});