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
    },
    android: {
      package: 'com.samuell_silva.appenxaqueoque',
      adaptiveIcon: {
        foregroundImage: './assets/logoenxaq.png',
        backgroundColor: '#FFFFFF',
      },
      plugins: [
        [
          'expo-splash-screen',
          {
            backgroundColor: '#FFFFFF',
            image: './assets/splash.png',
            dark: {
              image: './assets/splash.png',
              backgroundColor: '#000000',
            },
            imageWidth: 300,
          },
        ],
      ],
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain', // ou 'cover'
      backgroundColor: '#FFFFFF',
    },
  },
};
