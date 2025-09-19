import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Button from '../components/ui/Button';
import GradientOverlay from '../components/ui/GradientOverlay';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const handleGetStarted = () => {
    navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={{ uri: '/app-welcome-bg.png' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient overlay - dark at bottom, transparent at top */}
        <GradientOverlay />
        
        {/* Content overlay */}
        <View style={styles.contentOverlay}>
          {/* Call to Action positioned from bottom */}
          <View style={styles.ctaContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                onPress={handleGetStarted}
                variant="default"
                size="default"
                style={styles.getStartedButton}
                textStyle={styles.getStartedButtonText}
              >
                Get Started Today
              </Button>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Simulating gradient from black/80% at bottom to transparent at top
    backgroundColor: 'transparent',
    // We'll use multiple overlays to simulate the gradient
  },
  contentOverlay: {
    position: 'relative',
    zIndex: 10,
    height: '100%',
    flex: 1,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 96, // equivalent to bottom-24 (96px)
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonWrapper: {
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  getStartedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  getStartedButton: {
    // Custom styling for the button
    backgroundColor: 'rgba(0, 122, 255, 0.9)', // primary/90
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)', // primary/20
    paddingHorizontal: 32, // px-8
    paddingVertical: 12, // py-3
    borderRadius: 25, // rounded-full
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});