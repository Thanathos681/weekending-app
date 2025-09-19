import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../../constants/Colors';

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms and Conditions and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setErrors({ email: 'An account with this email already exists' });
        } else {
          Alert.alert('Registration Failed', error.message);
        }
      } else {
        onSuccess(formData.email);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsPress = () => {
    Linking.openURL('https://www.theweekending.co.uk/terms-and-conditions')
      .catch(err => {
        Alert.alert('Error', 'Could not open Terms and Conditions');
        console.error('Failed to open Terms URL:', err);
      });
  };

  const handlePrivacyPress = () => {
    Linking.openURL('https://www.theweekending.co.uk/privacy-policy')
      .catch(err => {
        Alert.alert('Error', 'Could not open Privacy Policy');
        console.error('Failed to open Privacy URL:', err);
      });
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: '', color: Colors.mutedForeground };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthMap = {
      0: { text: 'Very weak', color: Colors.destructive },
      1: { text: 'Weak', color: Colors.destructive },
      2: { text: 'Fair', color: Colors.warning },
      3: { text: 'Good', color: Colors.info },
      4: { text: 'Strong', color: Colors.success },
      5: { text: 'Very strong', color: Colors.success },
    };

    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Name Fields */}
      <View style={styles.nameRow}>
        <View style={styles.nameField}>
          <Text style={styles.label}>First Name</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              placeholder="John"
              placeholderTextColor={Colors.mutedForeground}
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              autoCapitalize="words"
            />
          </View>
          {errors.firstName && (
            <Text style={styles.errorText}>⚠ {errors.firstName}</Text>
          )}
        </View>

        <View style={styles.nameField}>
          <Text style={styles.label}>Last Name</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              placeholder="Doe"
              placeholderTextColor={Colors.mutedForeground}
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              autoCapitalize="words"
            />
          </View>
          {errors.lastName && (
            <Text style={styles.errorText}>⚠ {errors.lastName}</Text>
          )}
        </View>
      </View>

      {/* Email Field */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>✉</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="john@example.com"
            placeholderTextColor={Colors.mutedForeground}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.email && (
          <Text style={styles.errorText}>⚠ {errors.email}</Text>
        )}
      </View>

      {/* Password Field */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
            placeholder="Create a strong password"
            placeholderTextColor={Colors.mutedForeground}
            value={formData.password}
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

        {/* Password Strength Indicator */}
        {formData.password && (
          <View style={styles.strengthContainer}>
            <View style={styles.strengthBar}>
              <View 
                style={[
                  styles.strengthFill,
                  { 
                    width: `${(passwordStrength.strength / 5) * 100}%`,
                    backgroundColor: passwordStrength.color
                  }
                ]}
              />
            </View>
            <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
              {passwordStrength.text}
            </Text>
          </View>
        )}

        {errors.password && (
          <Text style={styles.errorText}>⚠ {errors.password}</Text>
        )}
      </View>

      {/* Confirm Password Field */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={[styles.input, styles.passwordInput, errors.confirmPassword && styles.inputError]}
            placeholder="Confirm your password"
            placeholderTextColor={Colors.mutedForeground}
            value={formData.confirmPassword}
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
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <Text style={styles.checkIcon}>✅</Text>
          )}
        </View>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>⚠ {errors.confirmPassword}</Text>
        )}
      </View>

      {/* Terms Checkbox */}
      <View style={styles.formGroup}>
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => {
            setAgreeToTerms(!agreeToTerms);
            if (errors.terms) {
              setErrors(prev => ({ ...prev, terms: '' }));
            }
          }}
        >
          <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
            {agreeToTerms && <Text style={styles.checkboxCheck}>✓</Text>}
          </View>
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxText}>I agree to the </Text>
            <TouchableOpacity onPress={handleTermsPress}>
              <Text style={styles.linkText}>Terms and Conditions</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxText}> and </Text>
            <TouchableOpacity onPress={handlePrivacyPress}>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        {errors.terms && (
          <Text style={styles.errorText}>⚠ {errors.terms}</Text>
        )}
      </View>

      {/* Info Alert */}
      <View style={styles.alertContainer}>
        <Text style={styles.alertIcon}>ℹ️</Text>
        <Text style={styles.alertText}>
          We'll send you a verification email to confirm your account. Check your inbox after registering.
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={[styles.submitButton, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.primaryForeground} />
        ) : (
          <Text style={styles.submitButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      {/* Switch to Login */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Already have an account? </Text>
        <TouchableOpacity onPress={onSwitchToLogin}>
          <Text style={styles.switchLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  nameField: {
    flex: 1,
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
  checkIcon: {
    position: 'absolute',
    right: 45,
    fontSize: 14,
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
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.muted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  strengthText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    minWidth: 80,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxCheck: {
    color: Colors.primaryForeground,
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
  checkboxTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.cardForeground,
    lineHeight: 20,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: Colors.primary,
    textDecorationLine: 'underline',
    lineHeight: 20,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.info + '20',
    borderWidth: 1,
    borderColor: Colors.info + '40',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  alertIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.cardForeground,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.primaryForeground,
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switchText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: Colors.mutedForeground,
  },
  switchLink: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: Colors.primary,
  },
});
