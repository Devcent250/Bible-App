import { Platform } from 'react-native';

// Get the local IP address of your development machine
const DEV_API_URL = Platform.select({
    ios: 'http://localhost:5000',
    android: 'http://10.0.2.2:5000', // Android emulator localhost
    default: 'http://localhost:5000'
});

// Use environment variable if available, otherwise use DEV_API_URL
export const API_URL = process.env.API_URL || DEV_API_URL;

// Add timeout for network requests
export const API_TIMEOUT = 10000; // 10 seconds 