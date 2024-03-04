import { Text, TextInput, View } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../shared/style/stylesheet';
import ExPressable from '../shared/components/buttons/pressable/ExPressable';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';

const stylesheet = {
  checkboxContainer: 'w-full flex-row items-center justify-between mb-[100px]',
};

export default function Login() {
  return (
    <AuthScaffold hasArrowBack>
      <Text className={sharedStyleSheet.title}>Acesse</Text>
      <Text className={sharedStyleSheet.subtitle}>
        Com e-mail e senha para entrar
      </Text>
      <InputContainer label='E-mail'></InputContainer>
      <InputContainer label='Senha'></InputContainer>
      <View className={stylesheet.checkboxContainer}>
        <BouncyCheckbox
          size={24}
          fillColor='#F1F1F1'
          unfillColor='#F7F7F7'
          text='Lembrar minha senha'
          textStyle={{ textDecorationLine: 'none' }}
        />
        <Text>Esqueci minha senha</Text>
      </View>

      <ExPressable title='Acessar' />
    </AuthScaffold>
  );
}
