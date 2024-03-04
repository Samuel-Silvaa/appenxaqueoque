import { Image, Text } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import ExPressable from '../shared/components/buttons/pressable/ExPressable';
import { sharedStyleSheet } from '../shared/style/stylesheet';

export default function UserType() {
  return (
    <AuthScaffold alignment='items-center'>
      <Text className={sharedStyleSheet.title}>Como deseja acessar?</Text>
      <Text className={sharedStyleSheet.subtitle}>Nos informe quem você é</Text>
      <Image source={require('assets/doctorchild.svg')} />
      <ExPressable colorScheme='light' title='Paciente' />
      <ExPressable colorScheme='light' title='Médico' />
      <ExPressable title='Continuar' />
    </AuthScaffold>
  );
}
