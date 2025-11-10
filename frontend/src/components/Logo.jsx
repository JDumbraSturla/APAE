import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Logo = ({ size = 'medium', variant = 'default' }) => {
  const getStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          icon: styles.iconSmall,
          text: styles.textSmall,
          subtitle: styles.subtitleSmall,
        };
      case 'large':
        return {
          container: styles.containerLarge,
          icon: styles.iconLarge,
          text: styles.textLarge,
          subtitle: styles.subtitleLarge,
        };
      default:
        return {
          container: styles.containerMedium,
          icon: styles.iconMedium,
          text: styles.textMedium,
          subtitle: styles.subtitleMedium,
        };
    }
  };

  const logoStyles = getStyles();
  const isLight = variant === 'light';

  return (
    <View style={[styles.container, logoStyles.container]}>
      <View style={[
        styles.iconContainer,
        size === 'small' && { width: 32, height: 32 },
        size === 'large' && { width: 64, height: 64 },
        isLight ? styles.iconContainerLight : styles.iconContainerDefault
      ]}>
        <Image 
          source={require('../../assets/logo-apae.png.jpg')}
          style={[
            logoStyles.icon,
            { 
              width: logoStyles.icon.fontSize,
              height: logoStyles.icon.fontSize,
              resizeMode: 'contain'
            }
          ]}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[
          styles.text, 
          logoStyles.text,
          isLight ? styles.textLight : styles.textDefault
        ]}>
          APAE
        </Text>
        <Text style={[
          styles.subtitle, 
          logoStyles.subtitle,
          isLight ? styles.subtitleLight : styles.subtitleDefault
        ]}>
          Digital
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    width: 48,
    height: 48,
  },
  iconContainerDefault: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconContainerLight: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textContainer: {
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  textDefault: {
    color: '#15803d',
  },
  textLight: {
    color: '#ffffff',
  },
  subtitle: {
    fontWeight: '500',
    marginTop: -2,
  },
  subtitleDefault: {
    color: '#6b7280',
  },
  subtitleLight: {
    color: '#d1d5db',
  },
  
  // Small size
  containerSmall: {
    iconContainer: {
      width: 32,
      height: 32,
    },
  },
  iconSmall: {
    fontSize: 16,
  },
  textSmall: {
    fontSize: 14,
  },
  subtitleSmall: {
    fontSize: 10,
  },
  
  // Medium size
  containerMedium: {
    iconContainer: {
      width: 48,
      height: 48,
    },
  },
  iconMedium: {
    fontSize: 24,
  },
  textMedium: {
    fontSize: 18,
  },
  subtitleMedium: {
    fontSize: 12,
  },
  
  // Large size
  containerLarge: {
    iconContainer: {
      width: 64,
      height: 64,
    },
  },
  iconLarge: {
    fontSize: 32,
  },
  textLarge: {
    fontSize: 24,
  },
  subtitleLarge: {
    fontSize: 14,
  },
});



export default Logo;