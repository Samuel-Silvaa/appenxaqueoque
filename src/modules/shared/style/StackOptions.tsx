import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import AppHeader from '../components/AppHeader/AppHeader';

const screenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: '#F7F7F7' },
  headerBackImageSource: require('assets/arrowback.png'),
  headerShadowVisible: false,
  headerTitle: () => '',
  header: (props) => <AppHeader {...props} />,
};

export default screenOptions;
