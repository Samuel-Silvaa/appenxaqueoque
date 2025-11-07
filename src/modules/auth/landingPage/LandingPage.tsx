import { Image, Text, View } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../shared/style/stylesheet';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { setPatientData } from 'src/infra/app/reducers/app.reducer';
import { setPatient, setToken } from 'src/infra/app/reducers/auth.reducer';

const LandingPage = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!!SecureStore.getItem('token') && !!SecureStore.getItem('user')) {
      dispatch(setPatientData(JSON.parse(SecureStore.getItem('user')!)));
      dispatch(setPatient(JSON.parse(SecureStore.getItem('user')!)));
      dispatch(setToken(SecureStore.getItem('token')!));
    }
  }, []);

  return (
    <AuthScaffold
      alignment='items-center'
      justify='justify-center'
      hasArrowBack={false}
      ctaPrimary={() => navigation.navigate('login')}
      ctaPrimaryText='Entrar'
      ctaSecondary={() => navigation.navigate('tenant')}
      ctaSecondaryText='Cadastrar'
    >
      <Image
        className='h-[50%]'
        resizeMode='contain'
        source={require('src/assets/welcome.png')}
      />
      <Text className={sharedStyleSheet.title}>Bem vindo! </Text>
      <Text className={sharedStyleSheet.subtitle + ' text-center '}>
        Entre ou cadastre-se para registrar seus episódios de dor de cabeça.
      </Text>
    </AuthScaffold>
  );
};

export default LandingPage;
