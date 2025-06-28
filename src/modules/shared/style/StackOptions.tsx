import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import AppHeader from '../components/appHeader/AppHeader';
import { Appearance } from 'react-native';

const screenOptions: NativeStackNavigationOptions = {
  headerStyle: { 
    backgroundColor: Appearance.getColorScheme() === 'light' ? '#F7F7F7' : '#23263F' 
  },
  headerBackImageSource: require('src/assets/arrowback.png'),
  headerShadowVisible: false,
  headerTitle: () => '',
  header: (props) => <AppHeader {...props} />,
};

export default screenOptions;
