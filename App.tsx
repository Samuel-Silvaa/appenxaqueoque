import { NavigationContainer } from '@react-navigation/native';
import { NativeWindStyleSheet } from 'nativewind';
import { useMemo } from 'react';
import { ToastProvider } from 'react-native-toast-notifications';
import { AuthProvider, useAuth } from 'src/infra/auth/auth';
import TabsRoutes from 'src/modules/app';
import AuthRoutes from 'src/modules/auth';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const ActiveRoutes = () => {
  const { isLogged } = useAuth();

  return useMemo(
    () => (isLogged ? <TabsRoutes /> : <AuthRoutes />),
    [isLogged]
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <ToastProvider>
        <AuthProvider>
          <ActiveRoutes />
        </AuthProvider>
      </ToastProvider>
    </NavigationContainer>
  );
};

export default App;
