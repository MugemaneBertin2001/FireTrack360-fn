import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SNACKBAR_HEIGHT = 60;

const SnackBar = ({ 
  visible, 
  message, 
  type = 'success', 
  duration = 3000,
  onDismiss 
}: {
  visible: boolean;
  message: string;
  type?: string;
  duration?: number;
  onDismiss?: () => void;
}) => {
  const translateY = useRef(new Animated.Value(SNACKBAR_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        hideSnackbar();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideSnackbar = () => {
    Animated.timing(translateY, {
      toValue: SNACKBAR_HEIGHT,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        type === 'error' ? styles.errorContainer : styles.successContainer,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={hideSnackbar}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    height: SNACKBAR_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  successContainer: {
    backgroundColor: '#4CAF50',
  },
  errorContainer: {
    backgroundColor: '#F44336',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  dismissText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SnackBar;