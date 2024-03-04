import { NavigationContainer } from '@react-navigation/native';
import { NativeWindStyleSheet } from 'nativewind';
import { AppRegistry } from 'react-native';

import Routes from 'src/modules/auth';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const App = () => {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
};

export default App;
