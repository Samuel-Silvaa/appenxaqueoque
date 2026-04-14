export type AppTheme = {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    text: string;
    title: string;
    mutedText: string;
    primary: string;
    primaryDark: string;
    headerBackground: string;
    pageBackgroundImage: any;
  };
};

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: '#F7F7F7',
    surface: '#FFFFFF',
    text: '#2E3E4B',
    title: '#2E3E4B',
    mutedText: '#9DA3A9',
    primary: '#8FD7FF',
    primaryDark: '#373D59',
    headerBackground: '#F7F7F7',
    pageBackgroundImage: require('src/assets/appbg.png'),
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#23263F',
    surface: '#373D59',
    text: '#9DA3A9',
    title: '#6E8DBB',
    mutedText: '#9DA3A9',
    primary: '#8FD7FF',
    primaryDark: '#1F2035',
    headerBackground: '#23263F',
    pageBackgroundImage: require('src/assets/dappbg.png'),
  },
};
