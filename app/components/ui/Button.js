import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Button variants similar to your web app
const buttonVariants = {
  default: {
    backgroundColor: '#007AFF', // primary
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#FF3B30', // red
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#E5E5EA',
    borderWidth: 1,
  },
  secondary: {
    backgroundColor: '#F2F2F7', // light gray
    borderColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
};

// Button sizes
const buttonSizes = {
  default: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 36,
  },
  lg: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    minHeight: 44,
  },
  icon: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
};

// Text colors for variants
const textColors = {
  default: '#FFFFFF',
  destructive: '#FFFFFF', 
  outline: '#007AFF',
  secondary: '#000000',
  ghost: '#007AFF',
  link: '#007AFF',
};

export default function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
  ...props 
}) {
  
  const variantStyle = buttonVariants[variant] || buttonVariants.default;
  const sizeStyle = buttonSizes[size] || buttonSizes.default;
  const textColor = textColors[variant] || textColors.default;

  const buttonStyle = [
    styles.button,
    variantStyle,
    sizeStyle,
    disabled && styles.disabled,
    style,
  ];

  const finalTextStyle = [
    styles.text,
    { color: textColor },
    variant === 'link' && styles.linkText,
    size === 'sm' && styles.smallText,
    size === 'lg' && styles.largeText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      activeOpacity={disabled || loading ? 1 : 0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={textColor} 
        />
      ) : (
        <Text style={finalTextStyle}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8, // space between icon and text
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 13,
  },
  largeText: {
    fontSize: 16,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});