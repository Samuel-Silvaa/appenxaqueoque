import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Text, useColorScheme } from 'react-native';
import { View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';
import { AppProvider } from 'src/infra/app/app';
import store from 'src/infra/app/store';
import TabsRoutes from 'src/modules/app';
import AuthRoutes from 'src/modules/auth';
import { appStateSelector, authSelector } from 'src/infra/app/selectors';
import { Loader } from 'src/modules/shared/components/loader/Loader';
import { Fragment, useEffect } from 'react';
import { clearErrorMessage } from "src/infra/app/reducers/auth.reducer";
import { clearAppErrorMessage } from "src/infra/app/reducers/app.reducer";
import { Linking } from 'react-native';
import { NativeWindStyleSheet } from "nativewind";
import { ColorSchemeSystem } from "nativewind/dist/style-sheet/color-scheme";


const ActiveRoutes = () => {
  const auth = useSelector((state) => authSelector(state));
  const app = useSelector(appStateSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toast = useToast();
  const scheme = useColorScheme(); // "light" | "dark"

  useEffect(() => {
    // Handle deeplinks
    const handleDeepLink = (url: string) => {
      if (url.includes('/confirm-email')) {
        const urlObj = new URL(url);
        const token = urlObj.searchParams.get('token');
        const email = urlObj.searchParams.get('email');
        
        if (token && email) {
          (navigation as any).navigate('confirmEmail', { token, email });
        }
      }
    };

    
NativeWindStyleSheet.setColorScheme(scheme as ColorSchemeSystem);

    // Handle initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle URL changes
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, [navigation]);

  useEffect(() => {

    if(app.error != null) {
        toast.show(app.error!, {type: 'danger', dangerColor: 'danger', onClose() {
          dispatch(clearAppErrorMessage());
        },});
    }
  }, [app])

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
      (navigation as any).navigate('patient');
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
  let containerClass = "w-3/4 h-[56px] rounded-[8px] flex items-start justify-center p-2 shadow-md";

  switch (toastOptions.type) {
    case "success":
      containerClass += " bg-green-500";
      break;
    case "danger":
      containerClass += " bg-red-500";
      break;
    case "warning":
      containerClass += " bg-yellow-500";
      break;
    default:
      containerClass += " bg-gray-200";
      break;
  }

  return (
    <View className={containerClass}>
      <Text className="text-white text-md font-medium">
        {toastOptions.message}
      </Text>
    </View>
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
