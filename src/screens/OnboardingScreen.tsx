// src/screens/OnboardingScreen.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: '🔍',
    title: 'Discover\nOpportunities',
    subtitle: 'Browse thousands of curated job listings from top companies across the Philippines and beyond.',
    accentColor: '#1A56DB',
    lightBg: '#EBF0FF',
    darkBg: '#0D1A3A',
  },
  {
    id: '2',
    icon: '🔖',
    title: 'Save &\nOrganize',
    subtitle: 'Bookmark roles that interest you and build your personal job shortlist for easy access anytime.',
    accentColor: '#0EA5E9',
    lightBg: '#E0F7FF',
    darkBg: '#071724',
  },
  {
    id: '3',
    icon: '✉',
    title: 'Apply with\nConfidence',
    subtitle: 'Submit clean, professional applications in minutes and take the next step in your career journey.',
    accentColor: '#059669',
    lightBg: '#ECFDF5',
    darkBg: '#031A11',
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      navigation.replace('MainTabs');
    }
  };

  const handleSkip = () => {
    navigation.replace('MainTabs');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const renderSlide = ({ item }: { item: typeof slides[0] }) => {
    const bg = theme === 'light' ? item.lightBg : item.darkBg;
    return (
      <View style={[styles.slide, { width }]}>
        {/* Icon Card */}
        <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
          <View style={[styles.iconCircle, { backgroundColor: item.accentColor + '22', borderColor: item.accentColor + '44' }]}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>
          {/* Decorative rings */}
          <View style={[styles.ring, styles.ring1, { borderColor: item.accentColor + '18' }]} />
          <View style={[styles.ring, styles.ring2, { borderColor: item.accentColor + '10' }]} />
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={[styles.slideTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.slideSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  const currentSlide = slides[activeIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />

      {/* Skip Button */}
      <View style={styles.skipRow}>
        <View style={styles.brandRow}>
          <View style={[styles.brandDot, { backgroundColor: currentSlide.accentColor }]} />
          <Text style={[styles.brandName, { color: colors.text }]}>JobFinder</Text>
        </View>
        {activeIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
            <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEventThrottle={16}
        style={styles.flatList}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomSection}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {slides.map((slide, i) => {
            const isActive = i === activeIndex;
            return (
              <View
                key={slide.id}
                style={[
                  styles.dot,
                  {
                    width: isActive ? 24 : 8,
                    backgroundColor: isActive ? currentSlide.accentColor : colors.border,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: currentSlide.accentColor }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>
            {activeIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>

        {/* Step counter */}
        <Text style={[styles.stepCounter, { color: colors.textMuted }]}>
          {activeIndex + 1} of {slides.length}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  brandName: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  flatList: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconWrapper: {
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: width * 0.36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 40,
    position: 'relative',
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  iconText: {
    fontSize: 48,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  ring1: {
    width: 160,
    height: 160,
  },
  ring2: {
    width: 210,
    height: 210,
  },
  textContent: {
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 40,
    marginBottom: 16,
  },
  slideSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 17,
    borderRadius: 16,
    gap: 8,
    marginBottom: 12,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  ctaArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  stepCounter: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
});

export default OnboardingScreen;