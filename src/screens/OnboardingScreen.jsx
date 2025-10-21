import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../theme/tokens';
import Button from '../components/ui/Button';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Bem-vindo à APAE Digital',
    subtitle: 'Sua jornada de cuidado e desenvolvimento começa aqui',
    icon: 'heart',
    color: designTokens.colors.primary[500],
  },
  {
    id: 2,
    title: 'Acompanhe o Progresso',
    subtitle: 'Monitore atividades, relatórios e desenvolvimento em tempo real',
    icon: 'trending-up',
    color: designTokens.colors.secondary[500],
  },
  {
    id: 3,
    title: 'Conecte-se com a Comunidade',
    subtitle: 'Professores, famílias e profissionais unidos pelo mesmo objetivo',
    icon: 'people',
    color: designTokens.colors.semantic.success,
  },
  {
    id: 4,
    title: 'Recursos de Acessibilidade',
    subtitle: 'Ferramentas inclusivas para todos os tipos de necessidades',
    icon: 'accessibility',
    color: designTokens.colors.semantic.info,
  },
];

const OnboardingScreen = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const goToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      slidesRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const skip = () => {
    onComplete();
  };

  const renderSlide = ({ item, index }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={64} color={item.color} />
        </View>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const Paginator = () => (
    <View style={styles.paginator}>
      {onboardingData.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });
        
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
                backgroundColor: onboardingData[currentIndex].color,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <LinearGradient
      colors={['#f8fafc', '#ffffff']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={skip} style={styles.skipButton}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <Animated.FlatList
        ref={slidesRef}
        data={onboardingData}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Paginator />
        
        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity onPress={goToPrev} style={styles.prevButton}>
              <Ionicons name="chevron-back" size={24} color={designTokens.colors.neutral[600]} />
            </TouchableOpacity>
          )}
          
          <View style={styles.buttonSpacer} />
          
          <Button onPress={goToNext} style={styles.nextButton}>
            {currentIndex === onboardingData.length - 1 ? 'Começar' : 'Próximo'}
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingHorizontal: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.md,
  },
  skipButton: {
    padding: designTokens.spacing.sm,
  },
  skipText: {
    fontSize: designTokens.typography.fontSizes.base,
    color: designTokens.colors.neutral[600],
    fontWeight: designTokens.typography.fontWeights.medium,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: designTokens.spacing.xl,
  },
  iconContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
  },
  title: {
    fontSize: designTokens.typography.fontSizes['3xl'],
    fontWeight: designTokens.typography.fontWeights.bold,
    color: designTokens.colors.neutral[800],
    textAlign: 'center',
    marginBottom: designTokens.spacing.md,
  },
  subtitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    color: designTokens.colors.neutral[600],
    textAlign: 'center',
    lineHeight: designTokens.typography.lineHeights.relaxed * designTokens.typography.fontSizes.lg,
  },
  footer: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingBottom: 40,
  },
  paginator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.xl,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prevButton: {
    padding: designTokens.spacing.md,
  },
  buttonSpacer: {
    flex: 1,
  },
  nextButton: {
    minWidth: 120,
  },
});

export default OnboardingScreen;