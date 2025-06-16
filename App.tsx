import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { NativeWindStyleSheet } from 'nativewind';
import { Text } from 'react-native';
import { View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';
import { AppProvider } from 'src/infra/app/app';
import store from 'src/infra/app/store';
import TabsRoutes from 'src/modules/app';
import AuthRoutes from 'src/modules/auth';
import { authSelector } from 'src/infra/app/selectors';
import { Loader } from 'src/modules/shared/components/loader/Loader';
import { Fragment, useEffect } from 'react';
import { clearErrorMessage } from "src/infra/app/reducers/auth.reducer";

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const ActiveRoutes = () => {
  const auth = useSelector((state) => authSelector(state));
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toast = useToast();

  useEffect(() => {

    if(auth.error != null) {
        toast.show(auth.error!, {type: 'danger', dangerColor: 'danger', onClose() {
          dispatch(clearErrorMessage());
        },});
    }
  }, [auth])

  useEffect(() => {
      if(auth.token && !auth.user ){
      toast.show('Bem vindo de volta! Finalize o cadastro do paciente para continuar.', {type: 'warning', dangerColor: 'danger', duration: 5000});
      navigation.navigate('patient' as never);
    }

  }, [auth.token])

  return (
    <Fragment>
      <Loader></Loader>
      {auth.token && auth.user && !auth.isFirstAccess ? <TabsRoutes /> : <AuthRoutes />}
    </Fragment>
  );
};

const Toast = ({ toastOptions }: { toastOptions: ToastProps }) => {
  return (
    <Fragment>
      <View className='bg-snow-white w-3/4 h-[56px] rounded-[8px] flex items-start justify-center p-2'>
        <Text className='text-black text-md'>{toastOptions.message}</Text>
      </View>
    </Fragment>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <ToastProvider
          swipeEnabled={true}
          animationDuration={400}
          animationType='slide-in'
          placement='top'
          offsetTop={40}
          duration={2000}
          renderToast={(toastOptions) => <Toast toastOptions={toastOptions} />}
        >
            <AppProvider>
              <ActiveRoutes />
            </AppProvider>
        </ToastProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
