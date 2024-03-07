import { NavigationContainer } from '@react-navigation/native';
import { NativeWindStyleSheet } from 'nativewind';
// import TabsRoutes from 'src/modules/app';
import Routes from 'src/modules/auth';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const App = () => {
  return (
    <NavigationContainer>
      {/* <TabsRoutes /> */}
      <Routes />
    </NavigationContainer>
  );
};

export default App;
