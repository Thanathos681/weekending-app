// components/ui/GradientOverlay.js
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export default function GradientOverlay() {
  return (
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
      locations={[0, 0.6, 1]} // Controls where each color appears
      style={styles.gradient}
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});