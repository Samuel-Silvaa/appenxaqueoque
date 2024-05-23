import { Image, Text } from 'react-native';
import AuthScaffold from '../../shared/components/authScaffold/AuthScaffold';
import ExPressable from '../../shared/components/buttons/pressable/ExPressable';
import { sharedStyleSheet } from '../../shared/style/stylesheet';
import { useState } from 'react';

const UserType = ({ navigation }) => {
  const [users, setUsers] = useState([
    {
      title: 'Paciente',
      icon: require('src/assets/scale.svg'),
      selected: false,
    },
    {
      title: 'Médico',
      icon: require('src/assets/stethoscope.svg'),
      selected: false,
    },
  ]);

  return (
    <AuthScaffold
      alignment='start'
      ctaPrimaryText='Continuar'
      ctaPrimary={() => navigation.navigate('tenant')}
    >
      <Text className={sharedStyleSheet.title}>Como deseja acessar?</Text>
      <Text className={sharedStyleSheet.subtitle}>Nos informe quem você é</Text>
      <Image
        className='self-center'
        source={require('src/assets/doctorchild.png')}
      />
      {users.map((userType) => (
        <ExPressable
          className='justify-start'
          colorScheme='light'
          title={userType.title}
          icon={userType.icon}
          selected={userType.selected}
          onPress={() => {
            setUsers(
              users.map((user) =>
                user.title == userType.title
                  ? { ...user, selected: true }
                  : { ...user, selected: false }
              )
            );
          }}
        />
      ))}
    </AuthScaffold>
  );
};

export default UserType;
