import React from 'react';
import { ActivityIndicator } from 'react-native';

const LoadingSpinner = ({ size = 'small', color = '#15803d' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'small';
      case 'lg': return 'large';
      default: return size;
    }
  };

  return <ActivityIndicator size={getSize()} color={color} />;
};

export default LoadingSpinner;