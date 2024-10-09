import { NavigationContainer } from '@react-navigation/native';
import { NativeWindStyleSheet } from 'nativewind';
import { Text } from 'react-native';
import { View } from 'react-native';
import { ToastProvider } from 'react-native-toast-notifications';
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';
import { AppProvider } from 'src/infra/app/app';
import { AuthProvider, useAuth } from 'src/infra/auth/auth';
import TabsRoutes from 'src/modules/app';
import AuthRoutes from 'src/modules/auth';
import { Loader } from 'src/modules/shared/components/loader/Loader';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const ActiveRoutes = () => {
  const { isLogged, session } = useAuth();

  return isLogged && !!session ? <TabsRoutes /> : <AuthRoutes />;
};

const Toast = ({ toastOptions }: { toastOptions: ToastProps }) => {
  return (
    <View className='bg-snow-white w-3/4 h-[56px] rounded-[8px] flex items-start justify-center p-2'>
      <Text className='text-black text-md'>{toastOptions.message}</Text>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <ToastProvider
        swipeEnabled={true}
        animationDuration={400}
        animationType='slide-in'
        placement='top'
        offsetTop={20}
        duration={2000}
        renderToast={(toastOptions) => <Toast toastOptions={toastOptions} />}
      >
        <AuthProvider>
          <AppProvider>
            <ActiveRoutes />
            {/* <Loader></Loader> */}
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </NavigationContainer>
  );
};

export default App;
