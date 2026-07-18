export default {
  expo: {
    name: 'Enxaque o quê?: Diário de Enxaqueca Infantil',
    slug: 'Enxaque o quê?: Diário de Enxaqueca Infantil',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    extra: {
      eas: {
        projectId: '2f361f4e-1942-44d6-b5bd-8f84856da1e0',
      },
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8080/',
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#FFFFFF',
      dark: {
        image: './assets/splash.png',
        backgroundColor: '#000000',
      },
    },
    android: {
      package: 'com.samuell_silva.appenxaqueoque',
      // Em prod deve ser false; em dev pode true via EXPO_PUBLIC_ALLOW_CLEARTEXT
      usesCleartextTraffic:
        process.env.EXPO_PUBLIC_ALLOW_CLEARTEXT === 'true',
      adaptiveIcon: {
        foregroundImage: './assets/logoenxaq.png',
        backgroundColor: '#FFFFFF',
      },
      splash: {
        image: './assets/splash.png',
        resizeMode: 'cover',
        backgroundColor: '#FFFFFF',
        dark: {
          image: './assets/splash.png',
          backgroundColor: '#000000',
        },
      },
      plugins: [
        [
          'expo-splash-screen',
          {
            backgroundColor: '#FFFFFF',
            image: './assets/splash.png',
            resizeMode: 'cover',
            dark: {
              image: './assets/splash.png',
              backgroundColor: '#000000',
            },
          },
        ],
      ],
    },
    ios: {
      splash: {
        image: './assets/splash.png',
        resizeMode: 'cover',
        backgroundColor: '#FFFFFF',
        dark: {
          image: './assets/splash.png',
          backgroundColor: '#000000',
        },
      },
    },
  },
};
