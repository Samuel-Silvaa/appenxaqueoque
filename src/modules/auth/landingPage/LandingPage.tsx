import { Image, Text } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../shared/style/stylesheet';
import ExPressable from '../shared/components/buttons/pressable/ExPressable';

export default function LandingPage({ navigation }) {
  return (
    <AuthScaffold
      alignment='items-center'
      justify='justify-center'
      hasArrowBack={false}
    >
      <Image source={require('assets/welcome.svg')} />
      <Text className={sharedStyleSheet.title}>Bem vindo! </Text>
      <Text className={sharedStyleSheet.subtitle + ' text-center'}>
        Faça seu login ou cadastre-se para <br /> iniciarmos seu acompanhamento
        médico.
      </Text>
      <ExPressable title='Login' onPress={() => navigation.navigate('login')} />
      <ExPressable
        colorScheme='light'
        onPress={() => navigation.navigate('userType')}
        title='Cadastrar'
      />
    </AuthScaffold>
  );
}
