import { Dimensions, Image, Text } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../shared/style/stylesheet';

const LandingPage = ({ navigation }) => {
  return (
    <AuthScaffold
      alignment='items-center'
      justify='justify-center'
      hasArrowBack={false}
      ctaPrimary={() => navigation.navigate('login')}
      ctaPrimaryText='Login'
      ctaSecondary={() => navigation.navigate('tenant')}
      ctaSecondaryText='Cadastrar'
    >
      <Image source={require('assets/welcome.png')} />
      <Text className={sharedStyleSheet.title}>Bem vindo! </Text>
      <Text className={sharedStyleSheet.subtitle + ' text-center '}>
        Faça seu login ou cadastre-se para iniciarmos seu acompanhamento médico.
      </Text>
    </AuthScaffold>
  );
};

export default LandingPage;
