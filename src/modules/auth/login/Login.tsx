import { Text, View, TouchableOpacity, Appearance } from 'react-native';
import AuthScaffold from '../shared/components/authScaffold/AuthScaffold';
import { sharedStyleSheet } from '../shared/style/stylesheet';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import InputContainer from 'src/modules/shared/components/inputContainer/InputContainer';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  clearErrorMessage,
  requestLogin,
} from 'src/infra/app/reducers/auth.reducer';
import { useAsyncAppDispatch } from 'src/infra/app/store';

const stylesheet = {
  checkboxContainer: 'w-full flex-row items-center justify-between mb-[100px]',
  forgotPasswordText:
    'text-xs text-black underline dark:text-d-text-gray no-underline',
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
  ,
  password: yup.string().required('Preencha sua senha'),
});

const Login = ({ navigation }: any) => {
  const dispatch = useAsyncAppDispatch();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    SecureStore.deleteItemAsync('welcome');
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearErrorMessage());
    };
  });

  const onSubmitHandler = async (data: LoginSchema) => {
    const res = await dispatch(requestLogin({ ...data, password: data.password.trim() }));

    if (
      res.meta.requestStatus === 'rejected' &&
      (res as any).error?.message?.includes('confirme seu email')
    ) {
      navigation.navigate(
        'sendEmailConfirmation' as never,
        { email: data.email, password: data.password } as never
      );
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('sendPasswordCode' as never, { email: '' } as never);
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
        placeholder='Digite seu e-mail'
      ></InputContainer>

      <InputContainer
        secureTextEntry={true}
        label='Senha'
        name='password'
        setValue={setValue}
        errors={errors}
        placeholder='Digite sua senha'
      ></InputContainer>

      <View className={stylesheet.checkboxContainer}>
        {/* <BouncyCheckbox
          iconImageStyle={{ tintColor: '#2E3E4B' }}
          size={24}
          fillColor='#F1F1F1'
          unfillColor='#F7F7F7'
          iconStyle={{ borderRadius: 8, marginRight: -5 }}
          text='Lembrar minha senha'
          textStyle={{
            textDecorationLine: 'none',
            fontSize: 12,
            color: Appearance.getColorScheme() == 'dark' ? '#9DA3A9' : '#2E3E4B',
          }}
        /> */}
        <View></View>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text className={stylesheet.forgotPasswordText}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>
      </View>
    </AuthScaffold>
  );
};

export default Login;
