import { Platform } from 'react-native';
import { useInterpolateConfig } from 'react-native-reanimated';

// Get the local IP address of your development machine
const DEV_API_URL = Platform.select({
    ios: 'http://172.20.10.8:4000',
    android: 'http://172.20.10.8:4000', // Android emulator localhost
    default: 'http://172.20.10.8:4000'
});

// Use environment variable if available, otherwise use DEV_API_URL
export const API_URL = process.env.API_URL || DEV_API_URL;

// Add timeout for network requests
export const API_TIMEOUT = 10000; // 10 seconds 

