import { Platform } from 'react-native';


const DEV_API_URL = Platform.select({
    ios: 'http://192.168.43.206:5000',
    android: 'http://192.168.43.206:5000', 
    default: 'http://192.168.43.206:5000',
});


export const API_URL = process.env.API_URL || DEV_API_URL;


export const API_TIMEOUT = 10000; 