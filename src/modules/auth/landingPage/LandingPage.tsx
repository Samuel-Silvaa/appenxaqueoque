import { Image, Text } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../shared/style/stylesheet';

const LandingPage = ({ navigation }) => {
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
        className='h-[45%] '
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
