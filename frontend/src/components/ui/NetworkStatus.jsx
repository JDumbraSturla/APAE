import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/tokens';
import { offlineService } from '../../services/offlineService';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [queueSize, setQueueSize] = useState(0);
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const unsubscribe = offlineService.addNetworkListener((online) => {
      setIsOnline(online);
      setQueueSize(offlineService.getQueueSize());
      
      if (!online) {
        // Show offline banner
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        // Hide offline banner after a delay
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 2000);
      }
    });

    return unsubscribe;
  }, []);

  if (isOnline && queueSize === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isOnline ? designTokens.colors.semantic.success : designTokens.colors.semantic.warning,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={isOnline ? 'cloud-done' : 'cloud-offline'}
          size={16}
          color="#ffffff"
        />
        <Text style={styles.text}>
          {isOnline
            ? queueSize > 0
              ? `Sincronizando ${queueSize} item(s)...`
              : 'Conectado'
            : 'Modo offline - Dados serão sincronizados quando voltar online'
          }
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: designTokens.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
    marginLeft: designTokens.spacing.sm,
  },
});

export default NetworkStatus;