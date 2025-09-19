// components/ui/GradientOverlay.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function GradientOverlay() {
  return (
    <View style={styles.gradientContainer}>
      {/* Multiple layers to simulate gradient from transparent to black */}
      <View style={[styles.gradientLayer, { backgroundColor: 'rgba(0, 0, 0, 0)' }]} />
      <View style={[styles.gradientLayer, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]} />
      <View style={[styles.gradientLayer, { backgroundColor: 'rgba(0, 0, 0, 0.2)' }]} />
      <View style={[styles.gradientLayer, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]} />
      <View style={[styles.gradientLayer, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]} />
      <View style={[styles.gradientLayer, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  gradientLayer: {
    flex: 1,
  },
});