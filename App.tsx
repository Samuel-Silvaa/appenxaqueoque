import { NavigationContainer } from '@react-navigation/native';
import { NativeWindStyleSheet } from 'nativewind';
import { useMemo } from 'react';
import { ToastProvider } from 'react-native-toast-notifications';
import { AppProvider } from 'src/infra/app/app';
import { AuthProvider, useAuth } from 'src/infra/auth/auth';
import TabsRoutes from 'src/modules/app';
import PhysicianTabRoutes from 'src/modules/physicianApp';
import AuthRoutes from 'src/modules/auth';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const ActiveRoutes = () => {
  const { isLogged, session } = useAuth();
  console.log(isLogged);

  return isLogged && !!session ? <TabsRoutes /> : <AuthRoutes />;
};
const App = () => {
  return (
    <NavigationContainer>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <ActiveRoutes />
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </NavigationContainer>
  );
};

export default App;
