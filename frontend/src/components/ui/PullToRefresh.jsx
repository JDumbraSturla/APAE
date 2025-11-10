import React, { useState, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Animated, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/tokens';
import { useTheme } from '../../contexts/ThemeContext';

const REFRESH_HEIGHT = 80;

const PullToRefresh = ({ children, onRefresh, refreshing = false }) => {
  const { theme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(refreshing);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setIsRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={designTokens.colors.primary[500]}
          colors={[designTokens.colors.primary[500]]}
        />
      }
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  refreshContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: REFRESH_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    ...designTokens.shadows.sm,
  },
  refreshIndicator: {
    marginBottom: designTokens.spacing.sm,
  },
  refreshText: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: designTokens.typography.fontWeights.medium,
  },
});

export default PullToRefresh;