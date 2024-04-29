import { Text, View } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../shared/style/stylesheet';
import ExPressable from '../shared/components/buttons/pressable/ExPressable';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'src/infra/auth/auth';
import { AuthenticationActions } from 'src/infra/auth/auth.actions';

const stylesheet = {
  checkboxContainer: 'w-full flex-row items-center justify-between mb-[100px]',
};

interface LoginSchema {
  email: string;
  password: string;
}

const loginSchema = yup.object<LoginSchema>().shape({
  email: yup
    .string()
    .email('Email inválido')
    .required('Preencha seu email')
    .default('bruna@gmail.com'),
  password: yup.string().required('Preencha sua senha').default('123123'),
});

const Login = () => {
  const { dispatch } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmitHandler = (data: LoginSchema) => {
    dispatch(AuthenticationActions.REQUEST_LOGIN, data);
  };

  return (
    <AuthScaffold
      alignment='start'
      ctaPrimary={handleSubmit(onSubmitHandler)}
      ctaPrimaryText='Acessar'
    >
      <Text className={sharedStyleSheet.title}>Acesse</Text>
      <Text className={sharedStyleSheet.subtitle}>
        Com e-mail e senha para entrar
      </Text>
      <InputContainer
        keyboardType='email-address'
        label='E-mail'
        name='email'
        setValue={setValue}
        errors={errors}
      ></InputContainer>

      <InputContainer
        keyboardType='visible-password'
        secureTextEntry={true}
        label='Senha'
        name='password'
        setValue={setValue}
        errors={errors}
      ></InputContainer>

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
    </AuthScaffold>
  );
};

export default Login;
