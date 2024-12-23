import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Dimensions, FlatList, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OnboardingItem {
  title: string;
  description: string;
  image: any;
}

const onboardingContents: OnboardingItem[] = [
  {
    title: 'Welcome to FireSecure360',
    description: 'Secure your world, one tap at a time',
    image: require('../assets/images/onboarding1.jpg'),
  },
  {
    title: 'Get Started',
    description: 'Create an account or log in to access all features',
    image: require('../assets/images/onboarding2.jpg'),
  },
  {
    title: 'Secure and Simple',
    description: 'Streamline your security management',
    image: require('../assets/images/onboarding3.jpg'),
  },
];

export default function Index() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const flatListRef = useRef<FlatList<OnboardingItem> | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentPage < onboardingContents.length - 1) {
        flatListRef.current?.scrollToIndex({ 
          index: currentPage + 1, 
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({ 
          index: 0, 
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [currentPage]);

  const checkOnboardingStatus = async (): Promise<void> => {
    try {
      const isOnboardingComplete = await AsyncStorage.getItem('isOnboardingComplete');
      if (isOnboardingComplete !== 'true') {
        router.push('/(auth)/login');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleNavigateToRegister = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('isOnboardingComplete', 'true');
      router.push('/(auth)/register');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleNavigateToLogin = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('isOnboardingComplete', 'true');
      router.push('/(auth)/login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const pageIndex = Math.round(contentOffset.x / screenWidth);
    setCurrentPage(pageIndex);
  };

  const renderOnboardingItem = ({ item }: { item: OnboardingItem }): JSX.Element => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <LinearGradient 
      colors={['#1E293B', '#334155']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.paginationContainer}>
          {onboardingContents.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentPage === index && styles.paginationDotActive
              ]}
            />
          ))}
        </View>

        <FlatList
          ref={flatListRef}
          data={onboardingContents}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={renderOnboardingItem}
          keyExtractor={(_, index) => index.toString()}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={handleNavigateToRegister}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={handleNavigateToLogin}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 30,
  },
  slide: {
    width: screenWidth,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.45,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  description: {
    fontSize: 16,
    color: '#E2E8F0',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
    paddingHorizontal: 30,
    opacity: 0.9,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 'auto',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    ...Platform.select({
      ios: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
  },
});